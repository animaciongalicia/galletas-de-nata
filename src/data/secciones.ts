/**
 * Secciones del portal. Para añadir una sección nueva basta con añadirla aquí:
 * la página de sección, el menú y los filtros se generan solos.
 */
export const SECCION_IDS = ['galletas', 'recetas', 'postres', 'nata'] as const;
export type SeccionId = (typeof SECCION_IDS)[number];

export interface Seccion {
  id: SeccionId;
  /** URL de la sección (sin barras). */
  slug: string;
  nombre: string;
  /** Nombre corto para menús y etiquetas. */
  corto: string;
  /** Título SEO de la página de sección. */
  tituloSeo: string;
  descripcion: string;
  /** Intención de búsqueda principal (documentación interna). */
  intencion: string;
  /** Texto del estado vacío. */
  vacio: string;
}

export const SECCIONES: Record<SeccionId, Seccion> = {
  galletas: {
    id: 'galletas',
    slug: 'galletas-de-nata',
    nombre: 'Galletas de nata',
    corto: 'Galletas de nata',
    tituloSeo: 'Galletas de nata gallegas: origen, ingredientes y conservación',
    descripcion:
      'Qué es una galleta de nata gallega, qué lleva, cómo se reconoce una buena y cómo conservarla para que no pierda su textura.',
    intencion: 'Informativa general: "galletas de nata", "galletas de nata gallegas".',
    vacio: 'Las primeras guías sobre la galleta de nata están en preparación.',
  },
  recetas: {
    id: 'recetas',
    slug: 'recetas',
    nombre: 'Recetas caseras',
    corto: 'Recetas',
    tituloSeo: 'Recetas caseras de galletas de nata, probadas paso a paso',
    descripcion:
      'Recetas completas de galletas de nata para hacer en casa: cantidades, tiempos y pasos probados en un horno doméstico.',
    intencion: 'Transaccional-receta: "receta galletas de nata", "galletas de nata caseras".',
    vacio: 'Ninguna receta se publica hasta que se ha probado entera. Las primeras están en el horno.',
  },
  postres: {
    id: 'postres',
    slug: 'postres-con-galletas',
    nombre: 'Postres con galletas',
    corto: 'Postres',
    tituloSeo: 'Postres con galletas de nata: tartas, copas y helados',
    descripcion:
      'Tartas, copas, helados y otros postres que aprovechan galletas de nata ya hechas, compradas o caseras.',
    intencion: 'Receta-uso: "postres con galletas de nata", "tarta de galletas de nata".',
    vacio: 'Los primeros postres con galletas de nata se están probando.',
  },
  nata: {
    id: 'nata',
    slug: 'nata-y-elaboracion',
    nombre: 'Nata y elaboración',
    corto: 'Nata',
    tituloSeo: 'La nata en las galletas: tipos, materia grasa y pruebas',
    descripcion:
      'Tipos de nata, qué significa su porcentaje de materia grasa y cómo cambia el resultado de una galleta según la nata y el proceso.',
    intencion: 'Informativa técnica: "tipos de nata", "nata de vaca", "nata casera".',
    vacio: 'Las explicaciones técnicas y las pruebas se publicarán cuando estén revisadas.',
  },
};

export const LISTA_SECCIONES = SECCION_IDS.map((id) => SECCIONES[id]);
