import type { APIContext } from 'astro';
import { ES_PRODUCCION } from '../lib/contenido';

// Producción: indexable. Preview y local: bloqueado por completo.
export function GET({ site }: APIContext) {
  const cuerpo = ES_PRODUCCION
    ? `User-agent: *\nAllow: /\n\nSitemap: ${new URL('/sitemap.xml', site).href}\n`
    : `# Preview: no indexar\nUser-agent: *\nDisallow: /\n`;
  return new Response(cuerpo, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
}
