import type { MarkdownHeading } from 'astro';
import { getCollection, type CollectionEntry } from 'astro:content';
import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import { SECCIONES, type SeccionId } from '../data/secciones';
import { tipografia } from './formato';

/**
 * Entorno de la build.
 * Producción = Vercel production o SITE_ENV=production. Todo lo demás es preview.
 */
export const ES_PRODUCCION =
  process.env.SITE_ENV === 'production' || process.env.VERCEL_ENV === 'production';

export type Articulo = CollectionEntry<'articulos'>;
export type Receta = CollectionEntry<'recetas'>;
export type Pagina = CollectionEntry<'paginas'>;
export type Pieza = Articulo | Receta;

/** Marca que deja un texto en el cuerpo cuando falta un dato real. */
const MARCA_PENDIENTE = /PENDIENTE|class="pendiente"/;

/**
 * En producción solo se ve lo aprobado y, si tiene fecha de publicación, cuando esa fecha ha llegado.
 * Así se pueden dejar piezas aprobadas con fecha futura: salen solas en el primer despliegue de ese día.
 */
const AHORA = new Date();
const visible = (e: { data: { estado: string; fechaPublicacion?: Date } }) =>
  !ES_PRODUCCION || (e.data.estado === 'aprobado' && (!e.data.fechaPublicacion || e.data.fechaPublicacion <= AHORA));

export const esAprobado = (e: { data: { estado: string } }) => e.data.estado === 'aprobado';

function validarAprobado(e: Pieza | Pagina) {
  if (!esAprobado(e)) return;
  if (MARCA_PENDIENTE.test(e.body ?? ''))
    throw new Error(`"${e.id}" está aprobado pero su texto aún contiene marcas PENDIENTE.`);
}

let cache: Promise<{ piezas: Pieza[]; paginas: Pagina[] }> | undefined;

async function cargar() {
  const [articulos, recetas, paginas] = await Promise.all([
    getCollection('articulos', visible),
    getCollection('recetas', visible),
    getCollection('paginas', visible),
  ]);
  const piezas: Pieza[] = [...articulos, ...recetas];
  [...piezas, ...paginas].forEach(validarAprobado);

  // Todas las URL cuelgan de la raíz: un id no puede repetirse ni chocar con una sección.
  const usados = new Set<string>(Object.values(SECCIONES).map((s) => s.slug));
  ['buscar', 'diario', 'historias-de-casa', 'rss.xml', 'sitemap.xml', 'robots.txt', '404'].forEach((s) => usados.add(s));
  for (const e of [...piezas, ...paginas]) {
    if (usados.has(e.id)) throw new Error(`URL duplicada: /${e.id}/. Cambia el nombre del archivo.`);
    usados.add(e.id);
  }
  piezas.sort(porFecha);
  return { piezas, paginas };
}

const cargarTodo = () => (cache ??= cargar());

/** Más recientes primero; los que no tienen fecha, al final y por título. */
function porFecha(a: Pieza, b: Pieza) {
  const fa = a.data.fechaPublicacion?.getTime() ?? 0;
  const fb = b.data.fechaPublicacion?.getTime() ?? 0;
  return fb - fa || a.data.titulo.localeCompare(b.data.titulo, 'es');
}

export async function getPiezas(seccion?: SeccionId) {
  const { piezas } = await cargarTodo();
  return seccion ? piezas.filter((p) => p.data.seccion === seccion) : piezas;
}

/** URL de una página solo si se publica en este entorno (evita enlaces rotos a borradores). */
export async function urlPaginaVisible(id: string) {
  return (await getPaginas()).some((p) => p.id === id) ? `/${id}/` : undefined;
}

export async function getPaginas() {
  return (await cargarTodo()).paginas;
}

/** Contenidos que entran en sitemap, RSS y marcado: solo aprobados. */
export async function getPublicadas() {
  return (await getPiezas()).filter(esAprobado);
}

export async function getRelacionadas(pieza: Pieza, max = 3) {
  const todas = await getPiezas();
  const elegidas = pieza.data.relacionados
    .map((id) => todas.find((p) => p.id === id))
    .filter((p): p is Pieza => Boolean(p));
  for (const p of todas) {
    if (elegidas.length >= max) break;
    if (p.id !== pieza.id && p.data.seccion === pieza.data.seccion && !elegidas.includes(p)) elegidas.push(p);
  }
  return elegidas.slice(0, max);
}

export const url = (id: string) => `/${id}/`;

/** Piezas de una etiqueta de ocasión, más recientes primero. */
export async function getPorEtiqueta(etiqueta: string) {
  return (await getPiezas()).filter((p) => (p.data.etiquetas as string[]).includes(etiqueta));
}
export const urlSeccion = (id: SeccionId) => `/${SECCIONES[id].slug}/`;
export const esReceta = (p: Pieza): p is Receta => p.collection === 'recetas';

export const ETIQUETA_ESTADO = {
  borrador: 'Borrador',
  revision: 'En revisión',
  aprobado: 'Aprobado',
} as const;

/**
 * HTML del cuerpo de un contenido. En producción, los enlaces internos a contenidos
 * que aún no se han publicado se convierten en texto normal: así cada pieza se puede
 * publicar sola sin dejar enlaces rotos. Cuando la otra pieza se publique, el enlace vuelve.
 */
// Fotos que pueden aparecer dentro del texto de un contenido (![alt](../../assets/fotos/…)).
const FOTOS = import.meta.glob<{ default: ImageMetadata }>('/src/assets/**/*.{jpg,jpeg,png,webp}', { eager: true });

/** Sustituye los marcadores de imagen del Markdown por <img> optimizadas (WebP, srcset, dimensiones). */
async function resolverImagenes(html: string) {
  // El Markdown deja cada imagen sola en un párrafo: se sustituye el párrafo entero por una <figure>.
  const marcas = [...html.matchAll(/(?:<p>)?<img __ASTRO_IMAGE_="([^"]+)">(?:<\/p>)?/g)];
  for (const [todo, json] of marcas) {
    const datos = JSON.parse(json.replace(/&quot;/g, '"')) as { src: string; alt: string };
    const ruta = '/src/' + datos.src.replace(/^(\.\.\/)+/, '');
    const foto = FOTOS[ruta]?.default;
    if (!foto) throw new Error(`Imagen no encontrada en el texto: ${datos.src}`);
    // Verticales y cuadradas van al lado del texto; las horizontales, a lo ancho de la línea.
    const lateral = foto.height / foto.width > 0.9;
    const maximo = lateral ? 640 : 1200;
    const anchos = [400, 640, 900, 1200].filter((w) => w < Math.min(foto.width, maximo)).concat(Math.min(foto.width, maximo));
    const sizes = lateral ? '(max-width: 40rem) 80vw, 20rem' : '(max-width: 48rem) 100vw, 46rem';
    const img = await getImage({ src: foto, widths: [...new Set(anchos)], format: 'webp', sizes });
    const ancho = Math.min(foto.width, maximo);
    const alto = Math.round((ancho * foto.height) / foto.width);
    const alt = datos.alt.replace(/"/g, '&quot;');
    html = html.replace(
      todo,
      `<figure class="foto foto--${lateral ? 'lateral' : 'ancha'}"><img src="${img.src}" srcset="${img.srcSet.attribute}" sizes="${sizes}" width="${ancho}" height="${alto}" alt="${alt}" loading="lazy" decoding="async"><figcaption aria-hidden="true">${datos.alt}</figcaption></figure>`,
    );
  }
  return html;
}

export type TextoSeccion = CollectionEntry<'secciones'>;

/** Historia de una sección (src/content/secciones/<id>.md), si existe. */
export async function getTextoSeccion(id: SeccionId) {
  return (await getCollection('secciones')).find((t) => t.data.seccion === id);
}

export async function htmlPublicable(e: Pieza | Pagina | TextoSeccion) {
  const html = tipografia(await resolverImagenes(e.rendered?.html ?? ''));
  const titulos = (e.rendered?.metadata?.headings ?? []) as MarkdownHeading[];
  if (!ES_PRODUCCION) return { html, titulos };
  const { piezas, paginas } = await cargarTodo();
  const publicadas = new Set<string>([...piezas, ...paginas].map((p) => `/${p.id}/`));
  Object.values(SECCIONES).forEach((s) => publicadas.add(`/${s.slug}/`));
  // Páginas fijas del sitio y etiquetas del Diario con piezas publicadas.
  ['/diario/', '/historias-de-casa/', '/buscar/'].forEach((r) => publicadas.add(r));
  piezas.forEach((p) => (p.data.etiquetas as string[]).forEach((e) => publicadas.add(`/diario/${e}/`)));
  const limpio = html.replace(/<a href="(\/[^"#?]*)"[^>]*>(.*?)<\/a>/gs, (todo, ruta: string, texto: string) =>
    ruta === '/' || publicadas.has(ruta) || ruta.includes('.') ? todo : texto,
  );
  return { html: limpio, titulos };
}

/** Imagen apta para la página: en producción, una provisional se sustituye por la de marca. */
export const imagenPublicable = <T extends { provisional: boolean }>(imagen: T) =>
  ES_PRODUCCION && imagen.provisional ? undefined : imagen;
