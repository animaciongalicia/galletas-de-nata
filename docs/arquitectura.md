# Mapa del sitio e intención de búsqueda

Origen canónico: `https://www.galletasdenata.com`. Todas las URL terminan en `/`. Todas cuelgan de la raíz (URL planas) para conservar las direcciones históricas sin redirecciones.

| URL | Tipo | Intención principal | No debe competir con |
| --- | --- | --- | --- |
| `/` | Portada | Navegacional: «galletas de nata» (marca/portal) | — |
| `/galletas-de-nata/` | Sección | Visión general: «galletas de nata gallegas» | `/galletas-de-nata-autenticas/` (más concreta: qué las hace auténticas) |
| `/recetas/` | Sección | «recetas de galletas de nata» | — |
| `/postres-con-galletas/` | Sección | «postres con galletas de nata» | — |
| `/nata-y-elaboracion/` | Sección | «tipos de nata», técnica | — |
| `/sobre-el-proyecto/` | Página | Quién escribe y criterio editorial (E-E-A-T) | — |
| `/contacto/`, `/aviso-legal/`, `/privacidad/`, `/cookies/` | Páginas | Legales y contacto | — |
| `/buscar/` | Utilidad | No indexable | — |

## Reglas para evitar canibalización

- Una pieza = una pregunta. Antes de crear una nueva, busca en `docs/calendario-editorial.md` si ya hay una con la misma intención; si la hay, amplía esa pieza.
- **Ingredientes** (qué aporta cada uno) ≠ **Nata de vaca** (tipos y materia grasa) ≠ **Pruebas con nata** (resultados de horno). Se enlazan entre sí, no se repiten.
- **Errores de textura** resuelve problemas; la **receta** no repite esa explicación: enlaza.
- El foco es la galleta de nata. Un postre solo entra si la galleta de nata es protagonista.

## Estados y entornos

| Estado | Preview (rama ≠ producción) | Producción |
| --- | --- | --- |
| `borrador` | Visible, marcado | No se genera |
| `revision` | Visible, marcado | No se genera |
| `aprobado` | Visible | Visible, en sitemap, RSS y JSON-LD |

La preview es siempre `noindex` (meta robots + `robots.txt` con `Disallow: /`). En producción, las secciones sin contenidos aprobados son `noindex` y no entran en el sitemap.
