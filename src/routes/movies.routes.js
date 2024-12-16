import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import{
    getProducts,
    createProduct,
    getProduct,
    deleteProduct,
    editProduct,
    updateProductNoUpdateImage,
    getPublicProducts,
    addMovieComment, 
    getMovieComments
}from '../controllers/movies.controller.js'
import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { moviesSchema } from "../schemas/movies.schemas.js";


const router = Router();
//obtener todos los productos
router.get('/products', authRequired,getProducts);

//agregar todos los producto
router.post('/products', authRequired, uploadImage, validateSchema(moviesSchema),createProduct);

//obtener un porducto por id 
router.get ('/products/:id', authRequired, getProduct);

//Eliminar un producto
router.delete('/products/:id', authRequired, deleteProduct);

//Actualizar un producto
router.put('/products/:id', authRequired, uploadImage, validateSchema(moviesSchema),editProduct)

router.put('/productupdatenoimage/:id', authRequired,validateSchema(moviesSchema), updateProductNoUpdateImage)

router.get('/public-movies', getPublicProducts);

router.post('/products/:id/comments', addMovieComment); // Añadir comentario
router.get('/products/:id/comments', getMovieComments); // Obtener comentarios


export default router;