import mongoose from 'mongoose';

const itemComandaSchema = new mongoose.Schema({
    tipus: {
        type: String,
        enum: ['cerveza', 'vino'],
        required: [true, 'El tipus de producte es obligatori']
    },
    producteId: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'El producteId es obligatori']
    },
    nom: {
        type: String,
        required: [true, 'El nom del producte es obligatori']
    },
    preuUnitari: {
        type: Number,
        required: [true, 'El preu unitari es obligatori'],
        min: [0, 'El preu unitari no pot ser negatiu']
    },
    quantitat: {
        type: Number,
        required: [true, 'La quantitat es obligatoria'],
        min: [1, 'La quantitat minima es 1']
    },
    subtotal: {
        type: Number,
        required: [true, 'El subtotal es obligatori'],
        min: [0, 'El subtotal no pot ser negatiu']
    }
}, { _id: false });

const comandaSchema = new mongoose.Schema({
    usuari: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
        index: true
    },
    items: {
        type: [itemComandaSchema],
        validate: {
            validator: function (v) {
                return Array.isArray(v) && v.length > 0;
            },
            message: 'La comanda ha de tenir minim un item'
        }
    },
    total: {
        type: Number,
        required: [true, 'El total es obligatori'],
        min: [0, 'El total no pot ser negatiu']
    }
}, { timestamps: true });

export default mongoose.model('Comanda', comandaSchema);
