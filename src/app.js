import express from 'express';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv'

dotenv.config();

//
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

import authRoutes from './routes/auth.routes.js';

import productRoutes from './routes/movies.routes.js';

import seriesRoutes from './routes/series.routes.js'

const app = express();
app.use(cors({
    origin: ['http://localhost:5173','http://localhost:3000',process.env.BASE_URL_BACKEND, process.env.BASE_URL_FRONTEND, 'https://frontendpelis.onrender.com'],
    credentials:true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: false}));
app.use('/img/', express.static(path.join(__dirname, '/public/img')))

//Indicamos que el servidor 
app.use('/api/', authRoutes);
app.use('/api', productRoutes);
app.use('/api', seriesRoutes);
app.get('/',(req, res)=>{
    res.json({
        mensaje: "Bienvenido a la API REST de productos",
        version: "1.0.0",
        rutasDisponibles: [
            {endpoint: "/api/register", metodo: "POST", descripcion: "Crea un nuevo usuario"},
            {endpoint: "/api/login", metodo: "POST", descripcion: "Para iniciar Sesion"}

        ]
    })
})
export default app;
 