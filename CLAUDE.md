# Instrucciones para Claude Code en este proyecto

Portal editorial estático (Astro 7 + TypeScript) sobre galletas de nata gallegas. Lee `README.md` y `docs/` antes de cambiar contenidos.

## Reglas de contenido (obligatorias)

- **No inventes** cantidades, proporciones, tiempos, temperaturas, rendimientos, resultados de pruebas, fechas, credenciales, certificaciones, opiniones, valoraciones ni datos nutricionales. Si falta un dato, déjalo en `pendientes:` o en `<div class="pendiente">…</div>`.
- Las recetas son siempre **caseras y reproducibles**. Nunca escribas la formulación industrial, proveedores, equipos o parámetros reservados en ningún archivo, commit ni comentario.
- Porcentajes de materia grasa: indica siempre unidad y base (% en masa, según etiqueta). No publiques «pureza» sin definir qué mide.
- Afirmaciones técnicas: solo con experiencia del autor (indicada como tal) o fuente primaria en `fuentes:`.
- No afirmes que otras recetas son falsas ni que solo sirve un método o máquina sin evidencia.
- No presentes imágenes provisionales o generadas como fotos reales. Las fotos propias van en `src/assets/fotos/`.
- El portal no representa a Maruxas, Gallegas de Nata ni a ninguna marca. No es una tienda. En los textos no se nombran marcas ni fundadores, ni se usa «maruxas» como nombre genérico: se dice «galleta de nata gallega». Fuentes y datos verificados en `docs/investigacion-fuentes.md`.
- **Voz:** los textos del portal van en tercera persona («el autor», «el proyecto», «en las pruebas del proyecto») o en segunda persona al lector («tú»). Nunca en primera persona («yo», «mis abuelas», «hice»), aunque el autor lo cuente así.
- **Tres porcentajes distintos:** grasa de la nata, proporción de nata en la masa y grasa de la galleta horneada. No los mezcles. Las tablas de cálculo por peso no son análisis de producto.
- **Leche cruda:** siempre con la advertencia de seguridad (EFSA): en frío, no consumir sin tratar, usar en elaboraciones cocinadas.
- Mantén el foco en la galleta de nata y evita piezas que compitan con otra ya existente (`docs/calendario-editorial.md`).

## Aprobar contenido

Solo cambia `estado` a `aprobado` cuando el propietario lo pida y el contenido esté completo. La build valida los requisitos; no los esquives.

## Antes de dar algo por terminado

```bash
npm run check
npm run build && npm run verificar -- preview
npm run build:produccion && npm run verificar -- produccion
```

## Código

- Componentes y estilos en español, como el resto del proyecto. Variables de diseño en `src/styles/global.css`.
- Sin dependencias, backend ni scripts externos nuevos sin una necesidad concreta.
- No subas `.env` ni credenciales.
