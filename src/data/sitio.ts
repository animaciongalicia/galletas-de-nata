/**
 * Datos generales del portal y del autor.
 * Rellena solo con datos reales. Un campo en null no se muestra en producción
 * ni se usa en el marcado estructurado.
 */
export const SITIO = {
  nombre: 'Galletas de Nata',
  lema: 'Todo sobre la galleta de nata gallega: cómo es, cómo se hace en casa y qué postres admite.',
  idioma: 'es-ES',
  locale: 'es_ES',
  /** Correo editorial público. null hasta que el propietario lo confirme. */
  correoEditorial: 'info@galletasdenata.com' as string | null,
  /**
   * Google Analytics 4. Solo se carga en producción, si el visitante lo acepta en el aviso de cookies
   * y cuando las páginas de cookies y privacidad están aprobadas.
   */
  analiticaId: 'G-5WHY80TLKX' as string | null,
};

export const AUTOR = {
  /** Nombre con el que firma el autor. null = firma «el autor de Galletas de Nata». */
  nombre: null as string | null,
  /** Una o dos frases verificables sobre su experiencia. */
  bio: null as string | null,
  /** Página propia del autor (perfil profesional, etc.), si la hay. */
  url: null as string | null,
};
