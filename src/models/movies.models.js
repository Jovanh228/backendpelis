import mongoose from "mongoose";
const commentSchema = new mongoose.Schema({
    username: { // Nombre del usuario
        type: String,
        required: true
    },
    text: { // Texto del comentario
        type: String,
        required: true
    },
    createdAt: { // Fecha del comentario
        type: Date,
        default: Date.now
    }
});
const moviesSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true
    },
    category:{
        type: String,
        required: true
    },
    description:{
        type: String,
        required: true
    },
    //duracion
    duration:{
        type: Number,
        default: 0,
        required: true
    },
    //calificacion
    calification:{
        type: Number,
        default: 0,
        required: true
    },
    image:{
        type: String,
        required: true
    },
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comments: [commentSchema]

});


export default mongoose.model('Products', moviesSchema);
