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
        if (!req.file) {
            return res.status(400).json({ error: "La imagen es obligatoria" });
        }

        const { nombre, precio, graduacion, tipo, descripcion } = req.body;
        const nuevaCerveza = new Cerveza({
            nombre,
            precio,
            graduacion,
            tipo,
            descripcion,
            imatge: `/uploads/${req.file.filename}`
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
        const { nombre, precio, graduacion, tipo, descripcion } = req.body;

        const cervezaActualizada = await Cerveza.findByIdAndUpdate(
            id,
            { nombre, precio, graduacion, tipo, descripcion },
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

export async function updateCervezaWithImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Cap fitxer pujat' });
        }

        const pathImatge = `/uploads/${req.file.filename}`;

        const actualitzada = await Cerveza.findByIdAndUpdate(
            req.params.id,
            { imatge: pathImatge },
            { new: true, runValidators: true }
        );

        if (!actualitzada) {
            return res.status(404).json({ error: 'Cervesa no trobada' });
        }

        res.json({ mensaje: 'Imagen de cerveza actualizada', cerveza: actualitzada });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}