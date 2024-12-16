import multer from 'multer';
import path from 'path';
import {v4 as uuid} from 'uuid'
import { fileURLToPath } from 'url';
import { json } from 'express';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage =multer.diskStorage({
    destination: path.join(__dirname, '../public/img'),
    filename: (req, file, cb, filename)=>{
        cb(null, uuid()+ path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits:{
        fieldSize: 5 * 1024 * 1024
    }
}).single('image');

export function uploadImage(req, res, next){
    upload(req, res, (err)=>{
        if(err){
            return res.status(500)
                        .json({message: ['Error al subir inagen ']})
        }
        next();
    })
}