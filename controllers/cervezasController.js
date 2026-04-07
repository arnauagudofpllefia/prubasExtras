import Cerveza from "../models/cervezasModel.js";

export async function getCervezas(req, res) {
    try {
        const cervezas = await Cerveza.find();
        console.log("Cervezas encontradas:", cervezas);
        res.json(cervezas);
    } catch (error) {
        console.error("Error en getCervezasAll:", error);
        res.status(500).json({ error: "Error al obtener cervezas" });
    }
}

export async function getCervezaById(req, res) {
    try {
        const { id } = req.params;
        const cerveza = await Cerveza.findById(id);
        res.json(cerveza);
    } catch (error) {
        res.status(500).json({ error: "Error al obtener cerveza" });
    }
}

export async function createCerveza(req, res) {
    try {
        const { nombre, precio } = req.body;
        const nuevaCerveza = new Cerveza({
            nombre,
            precio
        });
        
        await nuevaCerveza.save();
        res.status(201).json({ mensaje: "Cerveza creada", cerveza: nuevaCerveza });
    } catch (error) {
        res.status(500).json({ error: "Error al crear cerveza" });
    }
}

export async function updateCerveza(req, res) {
    try {
        const { id } = req.params;
        const { nombre, precio } = req.body;
        
        const cervezaActualizada = await Cerveza.findByIdAndUpdate(
            id,
            { nombre, precio },
            { new: true, runValidators: true }
        );
        res.json({ mensaje: "Cerveza actualizada", cerveza: cervezaActualizada });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar cerveza" });
    }
}

export async function deleteCerveza(req, res) {
    try {
        const { id } = req.params;
        const cervezaEliminada = await Cerveza.findByIdAndDelete(id);
        res.json({ mensaje: "Cerveza eliminada", cerveza: cervezaEliminada });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar cerveza" });
    }
}