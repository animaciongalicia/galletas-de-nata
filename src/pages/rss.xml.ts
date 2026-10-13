import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { SITIO } from '../data/sitio';
import { getPublicadas, url } from '../lib/contenido';

// Solo contenidos aprobados, también en la preview.
export async function GET(context: APIContext) {
  const piezas = await getPublicadas();
  return rss({
    title: SITIO.nombre,
    description: SITIO.lema,
    site: context.site!,
    trailingSlash: true,
    customData: '<language>es-es</language>',
    items: piezas.map((p) => ({
      title: p.data.titulo,
      description: p.data.descripcion,
      pubDate: p.data.fechaPublicacion,
      link: url(p.id),
    })),
  });
}
