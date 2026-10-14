/**
 * Etiquetas de ocasión. Agrupan piezas de distintas secciones en el Diario
 * (/diario/<etiqueta>/). Una etiqueta sin piezas publicadas no genera página.
 */
export const ETIQUETA_IDS = ['historia', 'con-ninos', 'navidad', 'sin-horno', 'para-regalar', 'merienda'] as const;
export type EtiquetaId = (typeof ETIQUETA_IDS)[number];

export const ETIQUETAS: Record<EtiquetaId, { nombre: string; descripcion: string }> = {
  historia: {
    nombre: 'Historia',
    descripcion: 'De dónde vienen las galletas de nata: Galicia, las vacas, la leche hervida y lo que se sabe de su origen.',
  },
  'con-ninos': {
    nombre: 'Con niños',
    descripcion: 'Recetas y postres con galletas de nata para hacer en familia, con tareas sencillas para los más pequeños.',
  },
  navidad: {
    nombre: 'Navidad',
    descripcion: 'Galletas de nata y postres para las fiestas: formas, bandejas y dulces para compartir en Navidad.',
  },
  'sin-horno': {
    nombre: 'Sin horno',
    descripcion: 'Postres que se montan con galletas de nata ya hechas, en el vaso o en la nevera, sin encender el horno.',
  },
  'para-regalar': {
    nombre: 'Para regalar',
    descripcion: 'Cómo preparar, guardar y presentar galletas de nata caseras para regalar.',
  },
  merienda: {
    nombre: 'Merienda',
    descripcion: 'Galletas de nata y acompañamientos para la merienda de siempre.',
  },
};

export const LISTA_ETIQUETAS = ETIQUETA_IDS.map((id) => ({ id, ...ETIQUETAS[id] }));
