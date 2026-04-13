import mongoose from "mongoose";

const cervezaSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    precio:{
        type: Number,
        required: [true, "El precio es obligatorio"]
    },
    graduacion: {
        type: Number,
        required: [true, "La graduacion es obligatoria"],
        min: [0, "La graduacion no puede ser negativa"]
    },
    tipo: {
        type: String,
        required: [true, "El tipo es obligatorio"],
        trim: true
    },
    descripcion: {
        type: String,
        required: [true, "La descripcion es obligatoria"],
        trim: true
    },
    imatge: {
        type: String,
        trim: true
    }
})

export default mongoose.model("Cerveza", cervezaSchema);