import app from './app.js';
import { connectDB } from './db.js';


connectDB();

const PORT = process.env.PORT || 3000;

app.listen(PORT);
console.log('servidor corriendo en el puerto ' + PORT);
