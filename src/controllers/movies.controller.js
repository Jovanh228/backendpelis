import Products from '../models/movies.models.js';
import { unlink } from 'fs/promises';
import path from 'path';
import fs from 'fs';
//funcion para obtener todos los productos
export const getProducts = async (req, res) => {
    try {
        const products = await Products.find({ user: req.user.id });
        res.json(products);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener los productos'] });
    }
}; // fin de getProducts

//funcion para crear un producto 
export const createProduct = async (req, res) => {
    try {
        if (!req.file.filename) {
            return res.status(500).json({ message: ['Error al crear un producto, no se encontró la imagen'] });
        }

        const { name, duration, calification, category, description } = req.body;
        const newProduct = new Products({
            name,
            duration,
            calification,
            description,
            category,
            image: req.file.filename,
            user: req.user.id
        });
        const savedProduct = await newProduct.save();
        res.json(savedProduct);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al crear un producto'] });
    }
}; // fin de createProduct

//funcion para obtener un producto 
export const getProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: ['Producto no encontrado'] });
        }
        res.json(product);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: ['Error al obtener un producto'] });
    }
};

// funcion para eliminar un producto 

export const deleteProduct = async (req, res) => {
    try {
      const product = await Products.findByIdAndDelete(req.params.id);
      if (!product) {
        return res.status(404).json({ message: ['Producto no encontrado'] });
      }
  
      const image = product.image;
      const imagePath = path.resolve('./src/public/img', image);
  
      // Verificar si el archivo existe antes de intentar eliminarlo
      if (fs.existsSync(imagePath)) {
        try {
          await unlink(imagePath); // Eliminar la imagen
        } catch (err) {
          console.error("Error al eliminar la imagen:", err);
          // Manejar el error, pero no interrumpir el flujo (no es crítico si la imagen ya no existe)
          return res.status(500).json({ message: ['Error al eliminar la imagen del servidor'] });
        }
      } else {
        console.warn("La imagen no existe en el servidor:", imagePath);
      }
  
      // Enviar respuesta exitosa
      res.json({ message: 'Producto eliminado correctamente', product });
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      res.status(500).json({ message: ['Error al eliminar el producto'] });
    }
  };


// funcion para editar un producto 
export const editProduct = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: ['Producto no encontrado'] });
        }

        // Si hay una nueva imagen, eliminamos la antigua
        let oldImage = product.image;
        let newImage = req.file ? req.file.filename : null;

        if (newImage) {
            // Si hay una nueva imagen, eliminamos la anterior
            const oldImagePath = path.resolve('./src/public/img', oldImage);
            unlink(oldImagePath, (err) => {
                if (err) {
                    console.error("Error al eliminar la imagen anterior", err);
                    return res.status(500).json({ message: ['Error al eliminar la imagen anterior'] });
                }
            });
        }

        // Los datos del producto a actualizar
        const updatedData = {
            name: req.body.name,
            duration: req.body.duration,
            calification: req.body.calification,
            description: req.body.description,
            category: req.body.category,
            image: newImage || oldImage, // Si no hay nueva imagen, mantenemos la antigua
            user: req.user.id
        };

        // Actualizamos el producto con la nueva imagen si la hay
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: ['Producto no encontrado'] });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: ['Error al actualizar el producto'] });
    }
};

export const updateProductNoUpdateImage = async (req, res) => {
    try {
        const product = await Products.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: ['Producto no encontrado'] });
        }

        // Aquí no actualizamos la imagen, usamos la imagen actual
        const updatedData = {
            name: req.body.name,
            duration: req.body.duration,
            calification: req.body.calification,
            description: req.body.description,
            category: req.body.category,
            image: product.image,  // Mantenemos la imagen existente
            user: req.user.id
        };

        // Actualizamos el producto sin cambiar la imagen
        const updatedProduct = await Products.findByIdAndUpdate(req.params.id, updatedData, { new: true });
        if (!updatedProduct) {
            return res.status(404).json({ message: ['Producto no encontrado'] });
        }

        res.json(updatedProduct);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: ['Error al actualizar el producto sin cambiar la imagen'] });
    }
};
export const getPublicProducts = async (req, res) => {
    try {
        const products = await Products.find(); // Obtiene todas las películas
        res.status(200).json(products);
    } catch (error) {
        console.error("Error al obtener las películas públicas:", error);
        res.status(500).json({ message: ['Error al obtener las películas públicas'] });
    }
};

export const addMovieComment = async (req, res) => {
    try {
        const { id } = req.params; // ID de la película
        const { username, text } = req.body; // Nombre de usuario y comentario

        // Validar que existan datos válidos
        if (!username || !text) {
            return res.status(400).json({ message: 'El nombre de usuario y el comentario son requeridos' });
        }

        const movie = await Products.findById(id);
        if (!movie) return res.status(404).json({ message: 'Película no encontrada' });

        // Agregar comentario al arreglo de comentarios
        const comment = { username, text };
        movie.comments.push(comment);

        await movie.save();
        res.status(200).json(movie.comments);
    } catch (error) {
        console.error("Error al añadir comentario:", error);
        res.status(500).json({ message: 'Error al añadir comentario' });
    }
};

// Obtener comentarios de una película
export const getMovieComments = async (req, res) => {
    try {
        const { id } = req.params; // ID de la película

        const movie = await Products.findById(id).select('comments');
        if (!movie) return res.status(404).json({ message: 'Película no encontrada' });

        res.status(200).json(movie.comments);
    } catch (error) {
        console.error("Error al obtener comentarios:", error);
        res.status(500).json({ message: 'Error al obtener comentarios' });
    }
};