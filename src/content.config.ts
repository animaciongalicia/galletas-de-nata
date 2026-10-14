import { defineCollection, type SchemaContext } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { SECCION_IDS } from './data/secciones';
import { ETIQUETA_IDS } from './data/etiquetas';

/**
 * Estados editoriales.
 * - borrador: en redacción. Solo visible en la preview.
 * - revision: completo, pendiente de que el propietario lo apruebe. Solo preview.
 * - aprobado: revisado y completo. Es lo único que se publica en producción.
 */
export const ESTADOS = ['borrador', 'revision', 'aprobado'] as const;

/** Fecha en formato AAAA-MM-DD. Se deja vacía hasta que exista una fecha real. */
const fecha = z.coerce.date().optional();

const imagen = ({ image }: SchemaContext) =>
  z.object({
    src: image(),
    alt: z.string().min(1, 'Describe la imagen en "alt".'),
    /** true = recurso provisional, no es fotografía propia. Se marca en la preview y nunca se muestra en producción. */
    provisional: z.boolean().default(false),
    /** Autoría o licencia de la fotografía. */
    credito: z.string().optional(),
  });

const comunes = (ctx: SchemaContext) => ({
  titulo: z.string().min(5).max(90),
  /** Descripción para buscadores y tarjetas: una frase clara, 70–160 caracteres. */
  descripcion: z.string().min(50).max(170),
  seccion: z.enum(SECCION_IDS),
  estado: z.enum(ESTADOS).default('borrador'),
  /** Intención de búsqueda principal. Uso interno: no se muestra al lector. */
  intencion: z.string().optional(),
  fechaPublicacion: fecha,
  fechaActualizacion: fecha,
  imagen: imagen(ctx),
  destacado: z.boolean().default(false),
  /** Ids de otros contenidos relacionados (nombre del archivo sin .md). */
  relacionados: z.array(z.string()).default([]),
  /** Etiquetas de ocasión para el Diario (con niños, Navidad, sin horno…). Ver src/data/etiquetas.ts. */
  etiquetas: z.array(z.enum(ETIQUETA_IDS)).default([]),
  /** Tareas o datos que debe aportar el propietario. Solo se muestran en la preview. */
  pendientes: z.array(z.string()).default([]),
  /** Fuentes primarias que respaldan afirmaciones técnicas. */
  fuentes: z
    .array(z.object({ titulo: z.string(), url: z.url().optional(), nota: z.string().optional() }))
    .default([]),
  /** Enlaces a puntos de compra. Se marcan para medir clics cuando haya analítica. */
  enlacesCompra: z.array(z.object({ nombre: z.string(), url: z.url() })).default([]),
});

/** Reglas que debe cumplir cualquier contenido para poder aprobarse. */
function exigirSiAprobado(
  data: {
    estado: string;
    fechaPublicacion?: Date;
    imagen: { provisional: boolean };
    pendientes: string[];
  },
  ctx: z.RefinementCtx,
) {
  if (data.estado !== 'aprobado') return;
  if (!data.fechaPublicacion)
    ctx.addIssue({ code: 'custom', message: 'Un contenido aprobado necesita fechaPublicacion real.' });
  if (data.pendientes.length > 0)
    ctx.addIssue({ code: 'custom', message: 'Resuelve y vacía "pendientes" antes de aprobar.' });
}

const articulos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/articulos' }),
  schema: (ctx) => z.object(comunes(ctx)).superRefine(exigirSiAprobado),
});

const minutos = z.number().int().positive().optional();

const ingrediente = z.object({
  nombre: z.string(),
  /** Cantidad numérica o texto ("una pizca"). null = pendiente de dato real. */
  cantidad: z.union([z.number().positive(), z.string()]).nullable().default(null),
  unidad: z.string().optional(),
  nota: z.string().optional(),
});

const recetas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/recetas' }),
  schema: (ctx) =>
    z
      .object({
        ...comunes(ctx),
        /** Siempre receta casera reproducible. La formulación industrial no se publica. */
        tipo: z.literal('casera').default('casera'),
        /** Ej.: "unas 20 galletas de 6 cm" o "1 tarta de 22 cm". */
        rendimiento: z.string().optional(),
        tiempos: z
          .object({ preparacion: minutos, reposo: minutos, coccion: minutos, total: minutos })
          .default({}),
        dificultad: z.enum(['fácil', 'media', 'alta']).optional(),
        ingredientes: z
          .array(z.object({ grupo: z.string().optional(), items: z.array(ingrediente).min(1) }))
          .default([]),
        pasos: z.array(z.string()).default([]),
        consejos: z.array(z.string()).default([]),
        /** Prueba real de la receta antes de aprobarla. */
        verificacion: z
          .object({ fecha: z.coerce.date(), notas: z.string().optional() })
          .optional(),
      })
      .superRefine((data, ctx) => {
        exigirSiAprobado(data, ctx);
        if (data.estado !== 'aprobado') return;
        const falta = (m: string) => ctx.addIssue({ code: 'custom', message: `Receta aprobada sin ${m}.` });
        if (!data.rendimiento) falta('rendimiento');
        if (!data.tiempos.total) falta('tiempo total');
        if (data.ingredientes.length === 0) falta('ingredientes');
        if (data.ingredientes.some((g) => g.items.some((i) => i.cantidad === null)))
          falta('todas las cantidades');
        if (data.pasos.length === 0) falta('pasos');
        if (!data.verificacion) falta('verificación (fecha de la prueba)');
      }),
});

const paginas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/paginas' }),
  schema: z.object({
    titulo: z.string(),
    descripcion: z.string().min(50).max(170),
    estado: z.enum(ESTADOS).default('borrador'),
    fechaActualizacion: fecha,
    pendientes: z.array(z.string()).default([]),
    /** Aparece en el pie de página. */
    enPie: z.boolean().default(false),
  }),
});

/**
 * Texto de cada sección: la historia que cuenta la página de sección antes de sus piezas.
 * Un archivo por sección (galletas.md, recetas.md…). Sin estados: se publica siempre,
 * así que solo lleva contenido completo y verificado.
 */
const secciones = defineCollection({
  loader: glob({ pattern: '*.md', base: './src/content/secciones' }),
  schema: (ctx) =>
    z
      .object({
        seccion: z.enum(SECCION_IDS),
        /** Titular grande de la cabecera (el H1). */
        titular: z.string().min(10).max(110),
        entradilla: z.string().min(40).max(260),
        imagen: imagen(ctx).optional(),
        /** Frase destacada en banda oscura. */
        cita: z.string().max(160).optional(),
        fuentes: z.array(z.object({ titulo: z.string(), nota: z.string().optional() })).default([]),
      })
      .superRefine((data, c) => {
        if (data.imagen?.provisional)
          c.addIssue({ code: 'custom', message: 'La cabecera de sección necesita una foto propia (provisional: false).' });
      }),
});

export const collections = { articulos, recetas, paginas, secciones };
