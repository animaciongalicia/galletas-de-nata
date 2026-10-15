import { SITIO } from '../data/sitio';
import { ES_PRODUCCION, urlPaginaVisible } from './contenido';

/**
 * La analítica solo se ofrece en producción, con un identificador configurado
 * y cuando las páginas de cookies y privacidad están publicadas.
 */
export async function analiticaActiva() {
  if (!ES_PRODUCCION || !SITIO.analiticaId) return undefined;
  const [cookies, privacidad] = await Promise.all([urlPaginaVisible('cookies'), urlPaginaVisible('privacidad')]);
  return cookies && privacidad ? { id: SITIO.analiticaId, cookies } : undefined;
}
