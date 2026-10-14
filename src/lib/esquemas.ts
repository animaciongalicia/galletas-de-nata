import { getImage } from 'astro:assets';
import { AUTOR, SITIO } from '../data/sitio';
import { SECCIONES } from '../data/secciones';
import { esAprobado, esReceta, type Pieza } from './contenido';
import { duracionIso, fechaIso, textoIngrediente } from './formato';

/**
 * JSON-LD Article / Recipe. Solo para contenidos aprobados: el marcado refleja
 * únicamente datos visibles y verificados. Nunca valoraciones ni nutrición.
 */
export async function esquemaPieza(pieza: Pieza, site: URL, ruta: string): Promise<object[]> {
  if (!esAprobado(pieza)) return [];
  const { data } = pieza;
  const img = await getImage({ src: data.imagen.src, width: 1200, format: 'jpg' });
  const comun = {
    headline: data.titulo,
    name: data.titulo,
    description: data.descripcion,
    image: [new URL(img.src, site).href],
    inLanguage: SITIO.idioma,
    url: new URL(ruta, site).href,
    mainEntityOfPage: new URL(ruta, site).href,
    ...(data.fechaPublicacion && { datePublished: fechaIso(data.fechaPublicacion) }),
    ...(data.fechaActualizacion && { dateModified: fechaIso(data.fechaActualizacion) }),
    // Sin nombre de autor, la autoría se atribuye al propio portal.
    author: AUTOR.nombre
      ? { '@type': 'Person', name: AUTOR.nombre, ...(AUTOR.url && { url: AUTOR.url }) }
      : { '@type': 'Organization', name: SITIO.nombre, url: site.href },
    publisher: { '@type': 'Organization', name: SITIO.nombre, url: site.href },
  };

  if (!esReceta(pieza)) return [{ '@type': 'Article', ...comun }];

  const r = pieza.data;
  const t = r.tiempos;
  return [
    {
      '@type': 'Recipe',
      ...comun,
      recipeCategory: SECCIONES[r.seccion].nombre,
      ...(r.rendimiento && { recipeYield: r.rendimiento }),
      ...(t.preparacion && { prepTime: duracionIso(t.preparacion) }),
      ...(t.coccion && { cookTime: duracionIso(t.coccion) }),
      ...(t.total && { totalTime: duracionIso(t.total) }),
      recipeIngredient: r.ingredientes.flatMap((g) => g.items.map(textoIngrediente)),
      recipeInstructions: r.pasos.map((texto, i) => ({
        '@type': 'HowToStep',
        position: i + 1,
        text: texto,
      })),
    },
  ];
}
