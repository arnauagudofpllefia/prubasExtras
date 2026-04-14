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
        if (!req.file) {
            return res.status(400).json({ error: "La imagen es obligatoria" });
        }

        const { nombre, precio, graduacion, tipo, descripcion } = req.body;
        const nuevoVino = new Vino({
            nombre,
            precio,
            graduacion,
            tipo,
            descripcion,
            imatge: `/uploads/${req.file.filename}`
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
        const { nombre, precio, graduacion, tipo, descripcion } = req.body;

        const vinoActualizado = await Vino.findByIdAndUpdate(
            id,
            { nombre, precio, graduacion, tipo, descripcion },
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

export async function updateVinoWithImage(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Cap fitxer pujat' });
        }

        const pathImatge = `/uploads/${req.file.filename}`;

        const actualitzat = await Vino.findByIdAndUpdate(
            req.params.id,
            { imatge: pathImatge },
            { new: true, runValidators: true }
        );

        if (!actualitzat) {
            return res.status(404).json({ error: 'Vi no trobat' });
        }

        res.json({ mensaje: 'Imagen de vino actualizada', vino: actualitzat });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
