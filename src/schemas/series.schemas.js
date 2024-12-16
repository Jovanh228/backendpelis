import { z } from 'zod';

export const seriesSchema = z.object({
    name: z.string({
        required_error: 'Nombre de la serie requerido'
    }),
    seasons: z.string({
        required_error: 'Número de temporadas debe ser un número'
    }).optional(),
    calification: z.string({
        required_error: 'Calificación debe ser un número'
    }).optional(),
    category: z.string({
        required_error: 'Categoría es requerida'
    }).optional(),
    description: z.string({
        required_error: 'Descripción es requerida'
    }).optional()
});