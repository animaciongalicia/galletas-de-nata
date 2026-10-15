# Mapa de migración desde el WordPress actual

## Estado del inventario

**No se ha podido inventariar la web pública.** El 13-10-2026, desde el entorno de trabajo, `www.galletasdenata.com` y `galletasdenata.com` no resolvían por DNS (`ENOTFOUND`) y la copia de archive.org no era accesible. Por eso no se han dado por válidos títulos, textos ni imágenes antiguos.

**Antes de cambiar el DNS**, el propietario debe:

1. Exportar desde WordPress (Herramientas → Exportar) o listar el sitemap (`/wp-sitemap.xml` o `/sitemap_index.xml`) con todas las URL.
2. Revisar en Google Search Console (si existe la propiedad) qué URL reciben clics e impresiones, y con qué consultas.
3. Guardar copia de las imágenes propias con derechos (`wp-content/uploads/`) para reutilizarlas.
4. Completar la tabla «URL adicionales» de abajo.

## URL históricas conocidas

Las cinco se **conservan en la misma dirección** (URL planas, con barra final). No hace falta redirigirlas.

| URL antigua | Decisión | Nueva pieza | Estado | Pendiente |
| --- | --- | --- | --- | --- |
| `/galletas-de-nata-autenticas/` | Conservar | Galletas de nata gallegas auténticas: qué las caracteriza | Borrador | Revisar contenido antiguo; aprobar |
| `/autentica-nata-de-vaca/` | Conservar | Nata de vaca: tipos, materia grasa y cuál usar | Borrador | Precisar «70 % de pureza»; verificar norma; aprobar |
| `/como-hacer-las-mejores-galletas-de-nata/` | Conservar | Cómo hacer galletas de nata caseras | Borrador | Receta completa y probada; aprobar |
| `/chocolate-caliente-con-galletas-de-nata/` | Conservar | Chocolate caliente con galletas de nata | Borrador | Receta completa y probada; aprobar |
| `/como-hacer-nata-casera/` | Conservar | Cómo hacer nata casera a partir de leche | Borrador | Método probado; aprobar |

**Riesgo:** en producción solo existen los contenidos aprobados. Si se cambia el DNS con estas piezas en borrador, sus URL devolverán 404 (con una página 404 útil que enlaza a las secciones). Decisión pendiente del propietario:

- **Opción A (recomendada):** no cambiar el DNS hasta que las cinco estén aprobadas.
- **Opción B:** cambiar antes y añadir en `vercel.json` redirecciones **temporales** (`"permanent": false`) de cada URL a su sección equivalente, y retirarlas al aprobar la pieza. Nunca a la portada.

**Decisión (15-10-2026): opción B.** Las cuatro URL históricas aún en borrador tienen una redirección temporal (302) a su sección, solo en `www.galletasdenata.com`. `/autentica-nata-de-vaca/` ya está publicada. Lista de comprobación completa en `docs/cambio-dominio.md`.

## Redirecciones configuradas (vercel.json)

| Origen | Destino | Tipo | Motivo |
| --- | --- | --- | --- |
| `galletasdenata.com/*` | `https://www.galletasdenata.com/*` | 308 permanente | Dominio canónico único con www |
| `/feed`, `/feed/` | `/rss.xml` | 308 permanente | Feed RSS habitual de WordPress |
| `/ruta` (sin barra) | `/ruta/` | 308 (automático, `trailingSlash: true`) | Política de barra final |

## URL adicionales (a completar con el inventario)

Patrones típicos de WordPress. Decide uno por uno con datos de Search Console; si una URL no tiene equivalente ni tráfico, se deja en 404 (o 410), **no** se redirige a la portada.

| Patrón antiguo | Propuesta | Decisión |
| --- | --- | --- |
| `/category/<nombre>/` | Sección equivalente (301) si existe | Pendiente |
| `/tag/<nombre>/` | 404 salvo tráfico demostrable | Pendiente |
| `/author/<nombre>/` | `/sobre-el-proyecto/` (301) | Pendiente |
| `/<año>/<mes>/<entrada>/` | Pieza equivalente (301) | Pendiente |
| `/wp-content/uploads/...` | Imágenes enlazadas desde fuera: valorar conservarlas | Pendiente |
| `/?p=<id>` | No redirigible en sitio estático; ignorar | — |

Cada redirección nueva se añade en `vercel.json` → `redirects` y se comprueba en la preview con `curl -I`.

## Orden del cambio (cuando la preview esté aprobada)

1. Aprobar al menos las cinco piezas históricas y las páginas legales.
2. Desplegar producción en Vercel y revisarla en su URL `*.vercel.app`.
3. En Vercel → Domains: añadir `www.galletasdenata.com` (principal) y `galletasdenata.com` (redirige a www).
4. Cambiar los registros DNS según indique Vercel. **Mantener el WordPress accesible** hasta comprobar el cambio.
5. Enviar `https://www.galletasdenata.com/sitemap.xml` en Search Console y vigilar errores 404 durante 4–8 semanas.
