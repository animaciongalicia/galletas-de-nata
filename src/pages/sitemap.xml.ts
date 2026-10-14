import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { LISTA_SECCIONES } from '../data/secciones';
import { esAprobado, getPaginas, getPiezas, getPublicadas, url } from '../lib/contenido';
import { fechaIso } from '../lib/formato';

// Sitemap propio: solo páginas aprobadas e indexables (nunca borradores, búsqueda ni 404).
export async function GET({ site }: APIContext) {
  const [publicadas, todas, paginas] = await Promise.all([getPublicadas(), getPiezas(), getPaginas()]);
  const conContenido = new Set(todas.filter(esAprobado).map((p) => p.data.seccion));
  const textos = new Set((await getCollection('secciones')).map((t) => t.data.seccion));

  const entradas: { loc: string; lastmod?: Date }[] = [
    { loc: '/' },
    ...LISTA_SECCIONES.filter((s) => conContenido.has(s.id) || textos.has(s.id)).map((s) => ({ loc: `/${s.slug}/` })),
    { loc: '/historias-de-casa/' },
    ...publicadas.map((p) => ({ loc: url(p.id), lastmod: p.data.fechaActualizacion ?? p.data.fechaPublicacion })),
    ...paginas.filter(esAprobado).map((p) => ({ loc: url(p.id), lastmod: p.data.fechaActualizacion })),
  ];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entradas
  .map(
    (e) =>
      `  <url><loc>${new URL(e.loc, site).href}</loc>${e.lastmod ? `<lastmod>${fechaIso(e.lastmod)}</lastmod>` : ''}</url>`,
  )
  .join('\n')}
</urlset>
`;
  return new Response(xml, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
}
