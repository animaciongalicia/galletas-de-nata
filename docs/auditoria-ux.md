# Auditoría UX de la web (15-10-2026)

Revisión página por página en escritorio (1366 px) y móvil (390 px), con capturas de la build de producción y de la de previsualización. Para cada página: qué fallaba, qué se ha corregido y qué queda.

## Sistema común (afecta a todas las páginas)

| Problema | Corrección |
| --- | --- |
| Convivían cuatro anchos (72, 60, 42 centrado y 42 a la izquierda). Cabecera, texto y tarjetas no empezaban en el mismo borde. | Tres medidas únicas: **72rem** marco (cabecera, pie y portada), **60rem** páginas de lectura y **42rem** línea de texto. En cada página de lectura, todo arranca en el mismo borde izquierdo. |
| Cada tipo de página tenía su propia cabecera (tamaños de título distintos, con o sin banda, fotos de distintas proporciones). | Componente común `CabeceraPagina`: banda crema, migas, antetítulo, título de 2,2 a 3,8rem en peso fino y foto opcional de 22rem en 4:3. Los artículos usan el mismo tamaño de título. |
| Fotos dentro del texto demasiado grandes (hasta 34rem de alto) y centradas fuera de la línea de lectura. | Máximo de 24rem de alto, alineadas con el texto. |
| Foto principal de los artículos en 16:9 a todo el ancho: ocupaba casi una pantalla. | Proporción 2:1 dentro de la columna de 60rem. |
| El «proyecto» y el autor tenían protagonismo. | Menú: «Historias de casa». Las piezas ya no llevan firma. |

## Portada

| Antes | Ahora |
| --- | --- |
| Apertura a pantalla completa con foto oscura: impactaba, pero desentonaba con el resto. | Apertura partida: titular a la izquierda y la foto antigua del ordeño, contenida, a la derecha. |
| «Tierra de vacas» con una sola cifra y sin imagen. | Foto de vacas en un prado gallego y dos cifras: ≈ 41 % de la leche y 56 % de las explotaciones lecheras de España. |
| Tres cifras sueltas (3 · 70-80 % · ≈ 50 %) sin hilo, con la mención a «las pruebas del proyecto». | **«Dos natas, dos galletas»**: comparación entre la nata de antes (70-80 % → galleta ≈ 50 % de grasa, sabe a nata) y la de hoy (35 % → ≈ 20 %, se parece a una de mantequilla). Explica el porqué en un vistazo. |
| En móvil, los cuatro pasos «Del cazo a la lata» ocupaban cuatro pantallas de foto. | En móvil, filas con miniatura y texto. |
| Tarjeta sin foto en «Cómo leer la etiqueta». | Ya tiene foto. |
| Foto de la banda «Historias de casa» muy alta. | 4:3 y 18rem de ancho. |

Orden final: apertura → tierra de vacas → del cazo a la lata → aprovechamiento → dos natas, dos galletas → recetas, nata y postres → historias de casa.

## Secciones (Galletas de nata, Recetas, Postres, Nata)

- Cabecera, relato, piezas y fuentes, todo en la columna de 60rem. Antes la cabecera iba a 72rem y el relato centrado a 42rem.
- Foto de cabecera contenida (22rem, 4:3). Antes era vertical y alta.
- Tarjetas a tres columnas dentro de la misma columna.
- Fotos nuevas en el relato: ordeño antiguo en «Galletas de nata»; vacas en el prado y nata en cazo de cobre en «Nata».

## Artículos y recetas

- Cabecera, foto, texto e índice lateral comparten la columna de 60rem. «Sigue leyendo» también, para no abrirse de golpe a 72rem al final.
- Título igualado con el resto de páginas.
- En la receta, la ficha (ingredientes y pasos) ocupa los 60rem y la explicación vuelve a la línea de 42rem.

## Historias de casa

- Cabecera común con la foto del ordeño en blanco y negro.
- **Buzón activo:** el botón «Enviar mi historia» abre el correo a info@galletasdenata.com con un guion ya preparado.

## Páginas legales, contacto, buscar y 404

- Misma cabecera común y texto a 42rem.
- **Contacto editorial** completado con el correo y publicado.
- Aviso legal, privacidad y cookies siguen en borrador: faltan titular, NIF y domicilio.

## Pendiente (mejoras siguientes)

1. **Fotos de postres** para la sección Postres, que hoy solo tiene relato.
2. **Una galleta partida**, para ver la miga en la receta y en «Nata o mantequilla».
3. **Datos legales**, para publicar aviso legal, privacidad y cookies antes de cambiar el dominio.
4. **Primeras historias recibidas:** cuando lleguen, crear una colección «historias» con su propia página y tarjetas.
5. Revisar con el autor la frase «la frisona subía del 6 % al 23 %» (fuente B) antes de darle más protagonismo.
