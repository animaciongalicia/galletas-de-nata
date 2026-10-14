# Galletas de Nata

Portal editorial sobre la galleta de nata gallega: información útil, recetas caseras y postres con galletas. Sitio estático hecho con [Astro](https://docs.astro.build) 7 y TypeScript, preparado para Vercel.

```bash
npm install
npm run dev               # http://localhost:4321 (modo preview: muestra borradores)
npm run check             # comprobación de tipos
npm run build             # build de preview (borradores visibles, noindex)
npm run build:produccion  # build de producción (solo aprobados, indexable)
npm run verificar -- produccion   # comprueba dist/ tras una build (o "preview")
```

Requiere Node 22.12 o superior.

## Estructura

```
src/content/articulos/   artículos (Markdown)
src/content/recetas/     recetas (Markdown con ficha estructurada)
src/content/paginas/     sobre el proyecto, contacto y páginas legales
src/assets/fotos/        fotografías propias
src/assets/provisional/  imágenes provisionales (se sustituyen)
src/data/                secciones, datos del sitio y del autor
src/components/ layouts/ pages/ lib/ styles/   código
docs/                    mapa del sitio, calendario editorial, mapa de migración
```

El nombre del archivo es la URL: `src/content/recetas/tarta-de-galletas-de-nata.md` → `/tarta-de-galletas-de-nata/`.

## 1. Añadir y aprobar una receta o artículo

1. Copia un archivo parecido de `src/content/recetas/` o `src/content/articulos/` con un nombre nuevo (minúsculas, guiones, sin tildes).
2. Rellena la cabecera (`titulo`, `descripcion`, `seccion`, `imagen`…) y escribe el texto en Markdown. Lo que falte, márcalo con `<div class="pendiente">…</div>` o en la lista `pendientes:`.
3. Deja `estado: borrador` mientras trabajas, o `revision` cuando esté listo para revisar. Se ve en la preview con su etiqueta, nunca en producción.
4. Para **aprobar**, cambia a `estado: aprobado`. La build **falla a propósito** si falta algo:
   - `fechaPublicacion` real, imagen no provisional, lista `pendientes` vacía y ninguna marca `PENDIENTE` en el texto.
   - En recetas: rendimiento, tiempo total, todas las cantidades, pasos y `verificacion.fecha` (el día en que la hiciste entera).
5. Al aprobar, la pieza entra en producción, en el sitemap, en el RSS y en el marcado `Article`/`Recipe`.

Las recetas publicadas son siempre **caseras y reproducibles**. La formulación industrial, los proveedores, los equipos y los parámetros reservados **no se escriben en ningún archivo del proyecto** (tampoco en borradores ni comentarios): Git guarda todo el historial. Si necesitas notas privadas, usa una carpeta `reservado/` fuera del control de versiones (ya está en `.gitignore`) o, mejor, fuera del proyecto.

## 2. Incorporar fotografías y actualizar contenidos con Claude Code

**Fotos:** súbelas a `src/assets/fotos/` (instrucciones, formato y lista de fotos por contenido en `src/assets/fotos/LEEME.md`) y apúntalas en la cabecera:

```yaml
imagen:
  src: ../../assets/fotos/tarta-entera.jpg
  alt: 'Tarta de galletas de nata entera sobre una mesa de madera'
  provisional: false
  credito: 'Foto: (autor)'
```

Astro genera los tamaños y el formato WebP, y reserva las dimensiones. La foto de la portada se cambia en `src/pages/index.astro` (`imagenPortada`). Las imágenes provisionales se generan con `npm run placeholders` y nunca se muestran en producción.

**Con Claude Code:** abre el proyecto y pide en lenguaje natural, por ejemplo:

- «Aquí tienes mi receta de tarta (cantidades, tiempos, pasos). Rellena `tarta-de-galletas-de-nata.md` y deja en `pendientes` lo que falte.»
- «He añadido `src/assets/fotos/copa.jpg`; ponla en la copa de yogur y quita la provisional.»
- «Aprueba la receta de chocolate caliente con fecha de hoy y pasa las comprobaciones.»

Claude Code sigue las reglas de `CLAUDE.md`: no inventa cantidades, tiempos ni resultados, y comprueba con `npm run check`, la build y `npm run verificar`.

## 3. Desplegar en Vercel y traspasar el proyecto

**Primer despliegue**

1. Sube el repositorio a GitHub.
2. En [vercel.com/new](https://vercel.com/new), importa el repositorio. Vercel detecta Astro y usa `vercel.json` (build `npm run build`, salida `dist`). No hace falta ninguna variable de entorno.
3. En *Settings → Git*, la rama de producción debe ser `main`. Cualquier otra rama genera una **preview**.
4. El entorno lo decide `VERCEL_ENV`: en producción solo se publica lo aprobado; en las previews se ven los borradores y todo es `noindex`.

**Dominio** (solo después de revisar la preview y `docs/mapa-migracion.md`): en *Settings → Domains*, añade `www.galletasdenata.com` como principal y `galletasdenata.com` redirigiendo a www; después cambia el DNS donde esté registrado el dominio. `vercel.json` ya incluye la redirección 308 de la versión sin www a la versión con www.

**Search Console:** crea la variable `PUBLIC_GOOGLE_SITE_VERIFICATION` en Vercel (solo producción) con el código de la etiqueta HTML y vuelve a desplegar. También puedes verificar por DNS y no necesitas nada en el código.

**Analítica:** está desactivada. Los enlaces a puntos de compra (`enlacesCompra` en la cabecera de un contenido) llevan `data-evento="clic-compra"` para medirlos cuando se elija un servicio. Antes de activarla: elige el servicio, revisa si usa cookies (si las usa, hace falta un aviso de consentimiento) y actualiza las páginas de privacidad y cookies.

**Traspasar a otro propietario**

1. GitHub: *Settings → General → Transfer ownership* del repositorio (o añadir al nuevo propietario como administrador).
2. Vercel: *Project Settings → General → Transfer Project* a la cuenta o equipo del nuevo propietario.
3. Dominio: transferir en el registrador y actualizar los DNS si cambia la cuenta de Vercel.
4. Actualizar `src/data/sitio.ts` (autor, correo) y las páginas legales con los datos del nuevo titular.

El proyecto no tiene base de datos, backend ni servicios de pago: todo está en el repositorio.

## Estado actual

**Implementado y comprobado** (comprobación de tipos, build de preview y de producción, `npm run verificar` en los dos modos, revisión en Chromium en móvil y escritorio):

- Portada, 4 secciones, plantillas de artículo y receta, páginas, búsqueda con filtros, 404, sitemap, RSS, robots, migas de pan, canonical, Open Graph, JSON-LD.
- Flujo editorial: los borradores no salen de la preview; aprobar un contenido incompleto rompe la build.
- Navegación con teclado, menú móvil sin JavaScript, búsqueda e impresión sin botones falsos si JavaScript no carga.

**Pendiente del propietario:** ver `docs/calendario-editorial.md` (contenidos, fotos, datos del autor y legales) y `docs/mapa-migracion.md` (inventario del WordPress, que no se pudo consultar).
