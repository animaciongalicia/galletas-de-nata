const fmtFecha = new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

export const fecha = (d: Date) => fmtFecha.format(d);
export const fechaIso = (d: Date) => d.toISOString().slice(0, 10);

/** 75 → "1 h 15 min" */
export function duracion(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return [h ? `${h} h` : '', m ? `${m} min` : ''].filter(Boolean).join(' ');
}

/** 75 → "PT1H15M" (ISO 8601, para Recipe) */
export function duracionIso(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `PT${h ? `${h}H` : ''}${m ? `${m}M` : ''}`;
}

export function textoIngrediente(i: { nombre: string; cantidad: number | string | null; unidad?: string; nota?: string }) {
  const cantidad = i.cantidad === null ? '' : `${i.cantidad}${i.unidad ? ` ${i.unidad}` : ''} `;
  return `${cantidad}${i.nombre}${i.nota ? ` (${i.nota})` : ''}`.trim();
}
