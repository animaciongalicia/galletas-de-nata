# Cambio de dominio: galletasdenata.com a Vercel

Revisión del 15-10-2026. ✅ = listo · ⏳ = pendiente del propietario · ⚠️ = cuidado.

> **Cambio hecho el 15-10-2026.** DNS en Piensa Solutions (ns97/ns98, sin cambiar *nameservers*): A de `@` → `216.150.1.1` y CNAME de `www` → registro propio de Vercel. Vercel marca los dos dominios como verificados y bien configurados. `galletas-de-nata.vercel.app` también redirige (308) a www.

## 1. Antes de tocar el DNS

| | Punto | Estado |
| --- | --- | --- |
| ✅ | Web en producción en Vercel (rama `claude/new-session-hf19a7`) | Lista |
| ✅ | Dominio canónico único: `https://www.galletasdenata.com`, con barra final | Configurado |
| ✅ | `galletasdenata.com` sin www redirige a www (308) | En `vercel.json` |
| ✅ | `/feed` redirige a `/rss.xml` | En `vercel.json` |
| ✅ | Sitemap (`/sitemap.xml`) y `robots.txt` de producción | Generados |
| ✅ | URL antiguas publicadas: `/autentica-nata-de-vaca/` | Misma dirección |
| ✅ | URL antiguas aún en borrador: redirección **temporal** a su sección, solo en el dominio real | En `vercel.json` |
| ✅ | El verificador avisa si una pieza se aprueba con su redirección temporal todavía puesta | Activo |
| ✅ | Publicación diaria programada (deploy hook y GitHub) | Activa |
| ✅ | Google Analytics `G-5WHY80TLKX` con aviso de consentimiento | Activo en producción |
| ✅ | Aviso legal, privacidad y cookies publicados (titular: AVOAS GALICIA SL, Ferrol) | Publicados. La LSSI pide además NIF y domicilio: añadirlos cuando se pueda |
| ✅ | Inventario del WordPress: solo 5 entradas, todas ya mapeadas | Ver `docs/mapa-migracion.md` |
| ⏳ | Copia de seguridad del WordPress y de sus imágenes | Hacerla antes del cambio |

### Redirecciones temporales (302) mientras la pieza no se publica

| URL antigua | Va a | Quitar cuando… |
| --- | --- | --- |
| `/galletas-de-nata-autenticas/` | `/galletas-de-nata/` | se publique la pieza |
| `/como-hacer-las-mejores-galletas-de-nata/` | `/recetas/` | se publique la receta |
| `/chocolate-caliente-con-galletas-de-nata/` | `/postres-con-galletas/` | se publique el postre |
| `/como-hacer-nata-casera/` | `/nata-y-elaboracion/` | se publique la pieza |

## 2. ⚠️ El correo: no lo rompas

**info@galletasdenata.com depende del DNS del dominio.** Si cambias los *nameservers* del dominio a Vercel, los registros del correo (MX, SPF, DKIM) desaparecen y el correo deja de llegar.

**Recomendación:** no cambies los nameservers. Deja el DNS donde está ahora y cambia **solo** los dos registros de la web (paso 3). El correo sigue igual.

Antes de tocar nada, **haz una captura de todos los registros DNS actuales**.

## 3. El cambio, paso a paso

1. **En Vercel**, abre el proyecto y ve a **Settings → Domains**:
   - añade `www.galletasdenata.com` como **principal**;
   - añade `galletasdenata.com` y elige **Redirect to www.galletasdenata.com**.
2. Vercel mostrará los registros exactos que necesita. Normalmente son:

   | Tipo | Nombre | Valor |
   | --- | --- | --- |
   | A | `@` (el dominio sin www) | `76.76.21.21` |
   | CNAME | `www` | `cname.vercel-dns.com` |

   **Usa siempre los valores que te muestre Vercel**: a veces asigna unos propios del proyecto.
3. **En el panel DNS de tu proveedor (Piensa Solutions)**, en el área de cliente, entra en el dominio y abre la gestión de DNS o zona DNS:
   - cambia el registro **A** de `@` por el de Vercel;
   - cambia o crea el **CNAME** de `www` con el de Vercel;
   - **no toques** los registros MX, TXT (SPF, DKIM, verificación de Google) ni ningún otro.
4. **Espera la propagación:** de unos minutos a unas horas. Vercel marca el dominio como válido y genera el certificado HTTPS solo.
5. **No borres el WordPress todavía:** déjalo accesible unas semanas por si hay que recuperar algo.

## 4. Justo después del cambio (comprobado el 15-10-2026)

- [x] `https://www.galletasdenata.com` sirve la web nueva con HTTPS (HSTS activo).
- [x] `galletasdenata.com` y `galletas-de-nata.vercel.app` redirigen (308) a www, conservando la ruta.
- [x] `/feed` lleva al RSS; `robots.txt` y `sitemap.xml` correctos (26 URL).
- [x] Las URL antiguas en borrador llevan a su sección; `/autentica-nata-de-vaca/` sigue en su sitio.
- [x] Las páginas indexables llevan `index, follow` y canónica en www; la 404 da 404 con `noindex`.
- [x] Aviso de cookies y Analytics `G-5WHY80TLKX` presentes.
- [ ] El correo a info@galletasdenata.com sigue llegando: mándate uno de prueba.
- [ ] En **Search Console**: envía `https://www.galletasdenata.com/sitemap.xml` e inspecciona la portada y dos o tres páginas.
- [ ] En **Analytics**: abre la web, acepta las cookies y comprueba que apareces en «Tiempo real».

## 5. Las semanas siguientes

- Revisar en Search Console, cada semana durante 4-8 semanas, los errores 404. Si aparece una URL antigua con visitas, redirigirla a su pieza equivalente, nunca a la portada.
- Al publicar cada pieza histórica, **quitar su redirección temporal** de `vercel.json`. El verificador lo recuerda.
- Cuando todo esté estable, dar de baja el hosting del WordPress.

## 6. Pendiente

1. **Recomendable:** NIF y domicilio de AVOAS GALICIA SL en el aviso legal (lo pide la LSSI).
