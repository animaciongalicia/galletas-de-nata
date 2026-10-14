// Genera imágenes PROVISIONALES para la preview: formas abstractas con un sello visible.
// No son fotografías ni pruebas de fabricación. Sustitúyelas por fotos propias
// (ver README, "Incorporar fotografías").
//
// Uso: npm run placeholders
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';

const SALIDA = new URL('../src/assets/provisional/', import.meta.url);

const PIEZAS = [
  ['portada', 'Portada', 2000, 1250],
  ['galletas-de-nata-autenticas', 'Galletas de nata'],
  ['como-se-hacian-las-galletas-de-nata', 'Cómo se hacían'],
  ['ingredientes-galletas-de-nata', 'Ingredientes'],
  ['como-conservar-galletas-de-nata', 'Conservación'],
  ['errores-textura-galletas-de-nata', 'Textura'],
  ['autentica-nata-de-vaca', 'Nata de vaca'],
  ['como-hacer-nata-casera', 'Nata casera'],
  ['pruebas-nata-en-galletas', 'Pruebas con nata'],
  ['como-hacer-las-mejores-galletas-de-nata', 'Receta casera'],
  ['tarta-de-galletas-de-nata', 'Tarta'],
  ['copa-de-yogur-fruta-y-galletas-de-nata', 'Copa de yogur'],
  ['postre-de-limon-con-galletas-de-nata', 'Postre de limón'],
  ['chocolate-caliente-con-galletas-de-nata', 'Chocolate caliente'],
];

const TONOS = ['#E4BD84', '#D6A15F', '#C98B4A', '#EBCB98', '#B97A3D'];

// Generador pseudoaleatorio con semilla: mismas imágenes en cada ejecución.
function azar(semilla) {
  let s = [...semilla].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);
  return () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
}

function svg(id, etiqueta, w, h) {
  const r = azar(id);
  let galletas = '';
  const n = 7 + Math.floor(r() * 5);
  for (let i = 0; i < n; i++) {
    const radio = (0.09 + r() * 0.1) * Math.min(w, h) * 1.3;
    const cx = r() * w;
    const cy = r() * h * 0.82;
    const tono = TONOS[Math.floor(r() * TONOS.length)];
    galletas += `<circle cx="${cx}" cy="${cy}" r="${radio}" fill="${tono}" opacity="0.92"/>`;
    galletas += `<circle cx="${cx}" cy="${cy}" r="${radio * 0.78}" fill="none" stroke="#FFF7E6" stroke-opacity="0.35" stroke-width="${radio * 0.04}" stroke-dasharray="${radio * 0.08} ${radio * 0.12}"/>`;
  }
  const banda = Math.round(h * 0.16);
  const f1 = Math.round(banda * 0.3);
  const f2 = Math.round(banda * 0.2);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="100%" height="100%" fill="#F6EFDF"/>
  ${galletas}
  <rect y="${h - banda}" width="100%" height="${banda}" fill="#5E6B33"/>
  <text x="${w * 0.04}" y="${h - banda * 0.55}" font-family="Inter, DejaVu Sans, sans-serif" font-weight="700" font-size="${f1}" fill="#FFF8EA" letter-spacing="2">IMAGEN PROVISIONAL · ${etiqueta.toUpperCase()}</text>
  <text x="${w * 0.04}" y="${h - banda * 0.2}" font-family="Inter, DejaVu Sans, sans-serif" font-size="${f2}" fill="#E9E2C8">Sustituir por fotografía propia antes de publicar</text>
</svg>`;
}

// Imagen de marca para compartir en redes (Open Graph) cuando una página no tiene foto.
// No es una fotografía: solo el nombre y el símbolo del portal.
const MARCA = new URL('../src/assets/marca/', import.meta.url);
const marca = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="100%" height="100%" fill="#F8F3E8"/>
  <rect x="0" y="560" width="1200" height="70" fill="#56632C"/>
  <g transform="translate(110 150) scale(5)">
    <path d="M32 3c3 0 4 3 7 3.6 3 .6 5.3-1.6 8-.2 2.6 1.4 2.4 4.6 4.6 6.6 2.2 2 5.4 1.6 6.8 4.2 1.4 2.6-.8 5-.2 8 .6 3 3.6 4 3.6 7s-3 4-3.6 7c-.6 3 1.6 5.3.2 8-1.4 2.6-4.6 2.4-6.6 4.6-2 2.2-1.6 5.4-4.2 6.8-2.6 1.4-5-.8-8-.2-3 .6-4 3.6-7 3.6s-4-3-7-3.6c-3-.6-5.3 1.6-8 .2-2.6-1.4-2.4-4.6-4.6-6.6-2.2-2-5.4-1.6-6.8-4.2-1.4-2.6.8-5 .2-8C5.8 36 3 35 3 32s3-4 3.6-7c.6-3-1.6-5.3-.2-8 1.4-2.6 4.6-2.4 6.6-4.6 2-2.2 1.6-5.4 4.2-6.8 2.6-1.4 5 .8 8 .2C28 5.8 29 3 32 3Z" fill="#D9A35E"/>
    <circle cx="32" cy="32" r="19" fill="none" stroke="#FFF3DC" stroke-width="2" stroke-dasharray="3 4"/>
    <g fill="#8A5526"><circle cx="25" cy="26" r="1.8"/><circle cx="39" cy="26" r="1.8"/><circle cx="32" cy="32" r="1.8"/><circle cx="25" cy="38" r="1.8"/><circle cx="39" cy="38" r="1.8"/></g>
  </g>
  <text x="510" y="300" font-family="Georgia, DejaVu Serif, serif" font-weight="700" font-size="92" fill="#2A2219">Galletas</text>
  <text x="510" y="400" font-family="Georgia, DejaVu Serif, serif" font-weight="700" font-size="92" fill="#2A2219">de Nata</text>
  <text x="512" y="460" font-family="Inter, DejaVu Sans, sans-serif" font-size="30" fill="#5B4E40">Recetas caseras, postres y nata</text>
</svg>`;
await mkdir(MARCA, { recursive: true });
await sharp(Buffer.from(marca)).jpeg({ quality: 88, mozjpeg: true }).toFile(new URL('og-galletas-de-nata.jpg', MARCA).pathname);
console.log('✓ marca/og-galletas-de-nata.jpg');

await mkdir(SALIDA, { recursive: true });
for (const [id, etiqueta, w = 1600, h = 1067] of PIEZAS) {
  await sharp(Buffer.from(svg(id, etiqueta, w, h)))
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(new URL(`${id}.jpg`, SALIDA).pathname);
  console.log(`✓ ${id}.jpg`);
}
