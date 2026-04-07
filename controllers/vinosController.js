import Vino from "../models/vinosModel.js";

export async function getVinosAll(req, res) {
    try {
        const vinos = await Vino.find();
        console.log("Vinos encontrados:", vinos);
        res.json(vinos);
    } catch (error) {
        console.error("Error en getVinosAll:", error);
        res.status(500).json({ error: "Error al obtener vinos" });
    }
}

export async function getVinosById(req, res) {
    try {
        const { id } = req.params;
        const vino = await Vino.findById(id);
        res.json(vino);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener vino" });
    }
}

export async function createVino(req, res) {
    try {
        const { nombre, precio } = req.body;       
        const nuevoVino = new Vino({
            nombre,
            precio
        });
        
        await nuevoVino.save();
        res.status(201).json({ mensaje: "Vino creado", vino: nuevoVino });
    } catch (error) {
        res.status(500).json({ error: "Error al crear vino" });
    }
}

export async function updateVino(req, res) {
    try {
        const { id } = req.params;
        const { nombre, precio } = req.body;
        
        const vinoActualizado = await Vino.findByIdAndUpdate(
            id,
            { nombre, precio },
            { new: true, runValidators: true }
        );

        res.json({ mensaje: "Vino actualizado", vino: vinoActualizado });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar vino" });
    }
}

export async function deleteVino(req, res) {
    try {
        const { id } = req.params;
        const vinoEliminado = await Vino.findByIdAndDelete(id); 
        res.json({ mensaje: "Vino eliminado", vino: vinoEliminado });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar vino" });
    }
}
