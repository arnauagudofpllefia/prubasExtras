import mongoose from "mongoose";

const vinoSchema = new mongoose.Schema({
    nombre:{
        type: String,
        required: [true, "El nombre es obligatorio"]
    },
    precio:{
        type: Number,
        required: [true, "El precio es obligatorio"]
    }
})

export default mongoose.model("Vino", vinoSchema);
