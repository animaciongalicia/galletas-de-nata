import { getCollection, type CollectionEntry } from 'astro:content';
import { SECCIONES, type SeccionId } from '../data/secciones';
import { AUTOR } from '../data/sitio';

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

const visible = (e: { data: { estado: string } }) => !ES_PRODUCCION || e.data.estado === 'aprobado';

export const esAprobado = (e: { data: { estado: string } }) => e.data.estado === 'aprobado';

function validarAprobado(e: Pieza | Pagina) {
  if (!esAprobado(e)) return;
  if (MARCA_PENDIENTE.test(e.body ?? ''))
    throw new Error(`"${e.id}" está aprobado pero su texto aún contiene marcas PENDIENTE.`);
  if (e.collection !== 'paginas' && !AUTOR.nombre)
    throw new Error(`"${e.id}" está aprobado pero falta el nombre del autor en src/data/sitio.ts.`);
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
  ['buscar', 'rss.xml', 'sitemap.xml', 'robots.txt', '404'].forEach((s) => usados.add(s));
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
export const urlSeccion = (id: SeccionId) => `/${SECCIONES[id].slug}/`;
export const esReceta = (p: Pieza): p is Receta => p.collection === 'recetas';

export const ETIQUETA_ESTADO = {
  borrador: 'Borrador',
  revision: 'En revisión',
  aprobado: 'Aprobado',
} as const;
