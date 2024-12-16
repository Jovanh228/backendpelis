import Series from '../models/series.models.js';
import { unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';

// Función para obtener todas las series
export const getSeries = async (req, res) => {
    try {
        const series = await Series.find({ user: req.user.id });
        res.json(series);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener las series'] });
    }
}; // fin de getSeries

// Función para crear una serie
export const createSeries = async (req, res) => {
    try {
        if (!req.file.filename) {
            return res.status(500).json({ message: ['Error al crear una serie, no se encontró la imagen'] });
        }

        const { name, seasons, calification, category, description } = req.body;
        const newSeries = new Series({
            name,
            seasons,
            calification,
            description,
            category,
            image: req.file.filename,
            user: req.user.id
        });
        const savedSeries = await newSeries.save();
        res.json(savedSeries);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al crear una serie'] });
    }
}; // fin de createSeries

// Función para obtener una serie
export const getSerie = async (req, res) => {
    try {
        const serie = await Series.findById(req.params.id);
        if (!serie) {
            return res.status(404).json({ message: ['Serie no encontrada'] });
        }
        res.json(serie);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener la serie'] });
    }
};

// Función para eliminar una serie
export const deleteSerie = async (req, res) => {
    try {
        const serie = await Series.findByIdAndDelete(req.params.id);
        if (!serie) {
            return res.status(404).json({ message: ['Serie no encontrada'] });
        }

        const image = serie.image;
        const imagePath = path.resolve('./src/public/img', image);

        // Verificar si el archivo existe antes de intentar eliminarlo
        if (fs.existsSync(imagePath)) {
            try {
                await unlink(imagePath); // Eliminar la imagen
            } catch (err) {
                console.error("Error al eliminar la imagen:", err);
                return res.status(500).json({ message: ['Error al eliminar la imagen del servidor'] });
            }
        } else {
            console.warn("La imagen no existe en el servidor:", imagePath);
        }

        res.json({ message: 'Serie eliminada correctamente', serie });
    } catch (error) {
        console.error("Error al eliminar la serie:", error);
        res.status(500).json({ message: ['Error al eliminar la serie'] });
    }
};

// Función para editar una serie
export const editSerie = async (req, res) => {
    try {
        const serie = await Series.findById(req.params.id);
        if (!serie) {
            return res.status(404).json({ message: ['Serie no encontrada'] });
        }

        let oldImage = serie.image;
        let newImage = req.file ? req.file.filename : null;

        if (newImage) {
            const oldImagePath = path.resolve('./src/public/img', oldImage);
            unlink(oldImagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen anterior", err);
                    return res.status(500).json({ message: ['Error al eliminar la imagen anterior'] });
                }
            });
        }

        const updatedData = {
            name: req.body.name,
            seasons: req.body.seasons,
            calification: req.body.calification,
            description: req.body.description,
            category: req.body.category,
            image: newImage || oldImage,
            user: req.user.id
        };

        const updatedSerie = await Series.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedSerie) {
            return res.status(404).json({ message: ['Serie no encontrada'] });
        }

        res.json(updatedSerie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: ['Error al actualizar la serie'] });
    }
};

// Función para actualizar una serie sin cambiar la imagen
export const updateSerieNoUpdateImage = async (req, res) => {
    try {
        const serie = await Series.findById(req.params.id);
        if (!serie) {
            return res.status(404).json({ message: ['Serie no encontrada'] });
        }

        const updatedData = {
            name: req.body.name,
            seasons: req.body.seasons,
            calification: req.body.calification,
            description: req.body.description,
            category: req.body.category,
            image: serie.image,  // Mantenemos la imagen existente
            user: req.user.id
        };

        const updatedSerie = await Series.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedSerie) {
            return res.status(404).json({ message: ['Serie no encontrada'] });
        }

        res.json(updatedSerie);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: ['Error al actualizar la serie sin cambiar la imagen'] });
    }
    
};

export const getPublicSeries = async (req, res) => {
    try {
        const series = await Series.find(); // Obtiene todas las series sin restricciones de usuario
        res.json(series);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener las series públicas'] });
    }
};

export const addSeriesComment = async (req, res) => {
    try {
        const { id } = req.params;
        const { username, text } = req.body;

        const series = await Series.findById(id);
        if (!series) return res.status(404).json({ message: 'Serie no encontrada' });

        const comment = { username, text };
        series.comments.push(comment);

        await series.save();
        res.status(200).json(series.comments);
    } catch (error) {
        console.error("Error al añadir comentario a la serie:", error);
        res.status(500).json({ message: 'Error al añadir comentario' });
    }
};
export const getSeriesComments = async (req, res) => {
    try {
        const { id } = req.params; // ID de la película

        const series = await Series.findById(id).select('comments');
        if (!series) return res.status(404).json({ message: 'Película no encontrada' });

        res.status(200).json(series.comments);
    } catch (error) {
        console.error("Error al obtener comentarios de la película:", error);
        res.status(500).json({ message: 'Error al obtener comentarios' });
    }
};
