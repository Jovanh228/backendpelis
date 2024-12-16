import {z} from 'zod';


export const moviesSchema = z.object({
    name: z.string({
        required_error: 'Nombre del producto requerido'
    }),
    duration: z.string({
        required_error: 'Precio debe ser un numero'
    }).optional(),
    calification: z.string({
        required_error: 'Ano debe ser un numero '
    }).optional(),
    category: z.string({
        required_error: 'Precio debe ser un numero'
    }).optional(),
    description: z.string({
        required_error: 'Ano debe ser un numero '
    }).optional()
})