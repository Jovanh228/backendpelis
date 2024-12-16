import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
    getSeries,
    createSeries,
    getSerie,
    deleteSerie,
    editSerie,
    updateSerieNoUpdateImage,
    getPublicSeries,
    addSeriesComment, 
    getSeriesComments
} from '../controllers/series.controller.js';
import { uploadImage } from "../middlewares/uploadImage.middleware.js";
import { validateSchema } from "../middlewares/validator.middleware.js";
import { seriesSchema } from "../schemas/series.schemas.js";

const router = Router();

// Obtener todas las series
router.get('/series', authRequired, getSeries);

// Agregar una serie
router.post('/series', authRequired, uploadImage, validateSchema(seriesSchema), createSeries);

// Obtener una serie por ID
router.get('/series/:id', authRequired, getSerie);

// Eliminar una serie
router.delete('/series/:id', authRequired, deleteSerie);

// Actualizar una serie con imagen
router.put('/series/:id', authRequired, uploadImage, validateSchema(seriesSchema), editSerie);

// Actualizar una serie sin cambiar la imagen
router.put('/seriesupdatenoimage/:id', authRequired, validateSchema(seriesSchema), updateSerieNoUpdateImage);

router.get('/public-series', getPublicSeries);

router.post('/series/:id/comments', addSeriesComment); // Añadir comentario
router.get('/series/:id/comments', getSeriesComments); // Obtener comentarios

export default router;
