# Plan de la web: de portal correcto a referencia

Estado a 14-10-2026 y hoja de ruta. Objetivo: que galletasdenata.com sea **la referencia en español sobre la galleta de nata gallega**: cómo es, cómo se hace en casa, qué nata necesita y qué se puede preparar con ella.

## 1. Dónde está la web hoy

**Publicado (producción):** 7 piezas + «Sobre el proyecto».

| Sección | Publicado |
| --- | --- |
| Galletas de nata | Cómo se hacían en Galicia · Nata o mantequilla |
| Recetas caseras | Tipos de galletas de nata |
| Postres con galletas | — (ninguno todavía) |
| Nata y elaboración | Nata de vaca · Pruebas de nata · Montar o cocinar · Etiqueta de la nata |

**En borrador:** 23 piezas (receta principal, 10 postres, ingredientes, conservación, textura, leche cruda, nata casera, ecológicas, legales…).

**Técnica:** Lighthouse 100/100/100/100 en móvil, sin enlaces de salida (la build falla si aparece uno), borradores invisibles en producción, JSON-LD solo en contenido aprobado.

## 2. Lo que frena que sea una referencia

1. **La receta principal sigue sin publicar.** Es la pieza más buscada y todo enlaza a ella. Falta la prueba con fecha, rendimiento y tiempos reales.
2. **Postres vacíos.** La sección existe pero no tiene nada publicado.
3. **Sin fotos reales.** La ilustración de marca cubre el hueco con dignidad, pero una web de cocina sin fotos no convence.
4. **Páginas legales pendientes** (aviso legal, privacidad, cookies, contacto): obligatorias antes de cambiar el dominio.
5. **Dominio:** galletasdenata.com sigue apuntando al WordPress.

## 3. Oleadas de contenido

Orden pensado para que cada oleada sostenga a la siguiente.

### Oleada 1 — La receta (bloqueante)
- `como-hacer-las-mejores-galletas-de-nata`: hacer la prueba según `docs/protocolo-pruebas.md`, anotar fecha, unidades, tiempos y temperatura real del horno, 4 fotos.
- Con ella se pueden publicar: `ingredientes-galletas-de-nata`, `errores-textura-galletas-de-nata`, `como-conservar-galletas-de-nata`, `galletas-de-nata-autenticas`.

### Oleada 2 — La nata, de principio a fin
- `leche-cruda-para-hacer-nata` (con advertencia EFSA) y `como-hacer-nata-casera`: necesitan rendimiento real (litros de leche → gramos de nata) y días de recogida.
- Esta oleada es la diferencia frente a cualquier recetario: nadie más explica la nata de la galleta tradicional.

### Oleada 3 — Postres (llenar la sección)
Probar y medir, uno por fin de semana, de más fácil a más difícil:
1. Copa de yogur, fruta y galletas
2. Copa de fresas con nata
3. Vasitos de queso
4. Trufas de chocolate
5. Tarta de galletas de nata
6. Postre de limón
7. Tarta de requeixo y miel
8. Tarta de café
9. Sándwich helado
10. Helado de nata (decidir base segura)
11. Chocolate caliente

### Oleada 4 — Reserva (solo si no canibaliza)
- Variante de la receta en robot de cocina («galletas de nata thermomix», 50 búsquedas/mes).
- Galletas de nata bañadas en chocolate (casera).
- Crumble con galletas de nata.
- Glosario de la nata (doble nata, materia grasa, pasteurizada, UHT, centrifugado).
- Repostería gallega con nata (bica, torta de nata): fuera del foco estricto; decidir antes de escribir.

## 4. Diseño y acabados

**Hecho en esta ronda:**
- Ilustración de marca (galletas dibujadas, un tono por sección) en lugar de imágenes de relleno.
- Portada: franja de datos clave (3 ingredientes · 70-80 % · ≈ 50 %), secciones numeradas, bloque del proyecto.
- Tarjetas con imagen a sangre y elevación al pasar el ratón.
- Prosa: tipografía mayor, entradilla destacada, h2 con filete, viñetas propias, tablas con cabecera y filas alternas, avisos en recuadro.
- Fuentes en pequeño, sin enlaces. Tiempo de lectura en artículos. Espacio fijo entre número y unidad («35 %» no se parte).

**Siguiente:**
- Cuando lleguen fotos: portada con foto real a toda anchura y galería de pasos en la receta.
- Tarjeta de receta imprimible más cuidada (ya hay estilos de impresión).
- Ficha visual de «las tres cifras» de la nata (grasa de la nata, nata en la masa, grasa de la galleta) como ilustración propia.
- Página «Todos los contenidos» con filtros por sección.

## 5. Fotos

Guía de subida y lista por pieza en `src/assets/fotos/LEEME.md`. Prioridad: portada, receta principal (4), nata (2), pruebas de nata, y cada postre según se pruebe.

## 6. Antes de cambiar el dominio

1. Completar y aprobar las páginas legales (titular, NIF, domicilio, correo).
2. Publicar al menos la receta principal.
3. Revisar `docs/mapa-migracion.md`: redirecciones 301 desde las URL del WordPress.
4. Separar ramas: `main` como producción y esta rama como previsualización de borradores (hoy cada push es producción).
5. Apuntar DNS a Vercel y dar de alta en Search Console; enviar `sitemap.xml`.

## 7. Qué necesita el autor aportar

- Fecha, rendimiento y tiempos de la prueba de la receta.
- Fotos (ver LEEME).
- Datos legales.
- Rendimiento de la nata casera (litros, días, gramos).
- Decisión sobre `galletas-de-nata-ecologicas` y la base del helado.
- Si quiere recomendar sitios donde comprar leche cruda (sin enlaces, solo nombre y zona).
