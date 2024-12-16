import {z} from 'zod';

export const registerSchema=z.object({
    username: z.string({

    }),
    email: z.string({
        required_error: 'Email requerido'
    })
    .email({
        required_error: 'Email invalido'

    }),
    password: z.string({
        required_error: 'Password es requerido'
    })
    .min(6, {
      message: 'El password debe teber al menos 6 caracteres'  
    })
});


export const loginSchema=z.object({

    email: z.string({
        required_error: 'Email requerido'
    })
    .email({
        required_error: 'Email invalido'

    }),
    password: z.string({
        required_error: 'Password es requerido'
    })
    .min(6, {
      message: 'El password debe teber al menos 6 caracteres'  
    })
});