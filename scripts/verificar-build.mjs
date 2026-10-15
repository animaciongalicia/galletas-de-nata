// Comprueba la carpeta dist/ después de una build.
// Uso: node scripts/verificar-build.mjs produccion|preview
import { readFile, readdir, stat } from 'node:fs/promises';
import { join, relative } from 'node:path';

const MODO = process.argv[2];
if (!['produccion', 'preview'].includes(MODO)) {
  console.error('Uso: node scripts/verificar-build.mjs produccion|preview');
  process.exit(2);
}
const PROD = MODO === 'produccion';
const ORIGEN = 'https://www.galletasdenata.com';
const DIST = new URL('../dist/', import.meta.url).pathname;
const CONTENIDO = new URL('../src/content/', import.meta.url).pathname;
const errores = [];
const error = (archivo, msg) => errores.push(`${archivo}: ${msg}`);

async function recorrer(dir) {
  const salida = [];
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const ruta = join(dir, e.name);
    if (e.isDirectory()) salida.push(...(await recorrer(ruta)));
    else salida.push(ruta);
  }
  return salida;
}

const existe = async (p) => stat(p).then(() => true, () => false);

async function rutaExiste(pathname) {
  const limpio = decodeURIComponent(pathname.split('#')[0].split('?')[0]);
  if (limpio === '/') return existe(join(DIST, 'index.html'));
  if (limpio.endsWith('/')) return existe(join(DIST, limpio, 'index.html'));
  return existe(join(DIST, limpio));
}

// Estado editorial de cada contenido según su frontmatter.
const estados = new Map();
const avisos = [];
for (const archivo of await recorrer(CONTENIDO)) {
  // Los textos de sección (src/content/secciones) no son piezas con estado editorial.
  if (!archivo.endsWith('.md') || archivo.includes('/content/secciones/')) continue;
  const texto = await readFile(archivo, 'utf8');
  const id = archivo.split('/').pop().replace(/\.md$/, '');
  estados.set(id, texto.match(/^estado:\s*(\w+)/m)?.[1] ?? 'borrador');
  // Aviso (no bloquea): artículos publicados con menos de 600 palabras de texto.
  if (archivo.includes('/content/articulos/') && estados.get(id) === 'aprobado') {
    const cuerpo = texto.split(/^---$/m).slice(2).join('---').replace(/!\[[^\]]*\]\([^)]*\)/g, '');
    const palabras = cuerpo.split(/\s+/).filter(Boolean).length;
    if (palabras < 600) avisos.push(`${id}: ${palabras} palabras (mínimo recomendado: 600)`);
  }
}
const noAprobados = [...estados].filter(([, e]) => e !== 'aprobado').map(([id]) => id);

const archivos = await recorrer(DIST);
const htmls = archivos.filter((a) => a.endsWith('.html'));

for (const archivo of htmls) {
  const rel = relative(DIST, archivo);
  const html = await readFile(archivo, 'utf8');
  const es404 = rel === '404.html';

  const h1 = (html.match(/<h1[\s>]/g) ?? []).length;
  if (h1 !== 1) error(rel, `tiene ${h1} H1 (debe tener 1)`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) error(rel, 'sin <title> válido');
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) error(rel, 'sin meta description suficiente');
  if (!/<html lang="es"[\s>]/.test(html)) error(rel, 'sin lang="es"');

  const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
  if (!canonical) error(rel, 'sin canonical');
  else if (!es404) {
    if (!canonical.startsWith(`${ORIGEN}/`)) error(rel, `canonical fuera del dominio: ${canonical}`);
    if (!canonical.endsWith('/')) error(rel, `canonical sin barra final: ${canonical}`);
  }

  const robots = html.match(/<meta name="robots" content="([^"]+)"/)?.[1] ?? '';
  if (!PROD && !robots.includes('noindex')) error(rel, 'la preview debe ser noindex');

  for (const img of html.match(/<img\b[^>]*>/g) ?? []) {
    if (!/\salt="[^"]*"/.test(img)) error(rel, 'imagen sin alt');
    if (!/\swidth="\d+"/.test(img) || !/\sheight="\d+"/.test(img)) error(rel, 'imagen sin dimensiones reservadas');
  }

  for (const [, href] of html.matchAll(/\shref="(\/[^"]*)"/g)) {
    if (href.startsWith('//')) continue;
    if (!(await rutaExiste(href))) error(rel, `enlace interno roto: ${href}`);
    else if (!href.includes('.') && !href.split('#')[0].endsWith('/')) error(rel, `enlace sin barra final: ${href}`);
  }

  for (const [, json] of html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)) {
    let datos;
    try {
      datos = JSON.parse(json);
    } catch {
      error(rel, 'JSON-LD inválido');
      continue;
    }
    if (['Recipe', 'Article'].includes(datos['@type'])) {
      const id = rel.replace(/\/index\.html$/, '');
      if (estados.get(id) !== 'aprobado') error(rel, `marcado ${datos['@type']} en un contenido no aprobado`);
      if ('aggregateRating' in datos || 'nutrition' in datos) error(rel, 'marcado con valoraciones o nutrición');
    }
  }

  const salientes = [...html.matchAll(/<a\s[^>]*href="(https?:)?\/\/[^"]*"/g)].length;
  if (salientes) error(rel, `${salientes} enlace(s) de salida (la web no enlaza fuera)`);

  if (PROD) {
    if (/class="aviso-preview"|class="pendiente"|class="[^"]*estado--|class="panel/.test(html))
      error(rel, 'restos de preview o borrador en producción');
    if (/class="sello"/.test(html)) error(rel, 'imagen provisional en producción');
  }
}

// Borradores: no deben existir en producción.
if (PROD) {
  for (const id of noAprobados) {
    if (await existe(join(DIST, id, 'index.html'))) error(id, 'contenido no aprobado publicado en producción');
  }
}

// Sitemap y RSS: solo URL aprobadas, en el dominio canónico y existentes.
const sitemap = await readFile(join(DIST, 'sitemap.xml'), 'utf8');
for (const [, loc] of sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)) {
  if (!loc.startsWith(`${ORIGEN}/`) || !loc.endsWith('/')) error('sitemap.xml', `URL no canónica: ${loc}`);
  const ruta = new URL(loc).pathname;
  if (noAprobados.includes(ruta.replaceAll('/', ''))) error('sitemap.xml', `incluye un borrador: ${loc}`);
  if (!(await rutaExiste(ruta))) error('sitemap.xml', `URL inexistente: ${loc}`);
}
const rss = await readFile(join(DIST, 'rss.xml'), 'utf8');
for (const [, link] of rss.matchAll(/<item>.*?<link>([^<]+)<\/link>/gs)) {
  if (!link.startsWith(`${ORIGEN}/`)) error('rss.xml', `enlace no canónico: ${link}`);
  if (noAprobados.includes(new URL(link).pathname.replaceAll('/', ''))) error('rss.xml', `incluye un borrador: ${link}`);
}

const robots = await readFile(join(DIST, 'robots.txt'), 'utf8');
if (PROD && !robots.includes(`Sitemap: ${ORIGEN}/sitemap.xml`)) error('robots.txt', 'falta el sitemap');
if (!PROD && !/Disallow: \/\s*$/m.test(robots)) error('robots.txt', 'la preview debe bloquear todo');

// Nada reservado ni credenciales en la salida pública.
for (const archivo of archivos.filter((a) => /\.(html|xml|txt|js|json)$/.test(a))) {
  const texto = await readFile(archivo, 'utf8');
  if (/(api[_-]?key|secret|token|password)\s*[:=]\s*["'][^"']{8,}/i.test(texto))
    error(relative(DIST, archivo), 'posible credencial en la salida');
}

// Redirecciones temporales de URL antiguas: hay que quitarlas cuando la pieza se publica,
// porque en Vercel una redirección tapa a la página.
const vercel = JSON.parse(await readFile(new URL('../vercel.json', import.meta.url), 'utf8'));
for (const r of vercel.redirects ?? []) {
  if (r.permanent !== false) continue;
  const id = r.source.replaceAll('/', '');
  if (estados.get(id) === 'aprobado') error('vercel.json', `quita la redirección temporal de ${r.source}: la pieza ya está aprobada`);
}
for (const a of avisos) console.log(`· Aviso: ${a}`);
console.log(`Modo: ${MODO} · ${htmls.length} páginas HTML · ${noAprobados.length} contenidos no aprobados`);
if (errores.length) {
  console.error(`\n✗ ${errores.length} problema(s):\n- ${errores.join('\n- ')}`);
  process.exit(1);
}
console.log('✓ Todas las comprobaciones han pasado.');
