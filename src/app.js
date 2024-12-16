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
    origin: ['http://localhost:5173','http://localhost:3000',process.env.BASE_URL],
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
export default app;
 