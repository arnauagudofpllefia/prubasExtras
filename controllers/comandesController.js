import Comanda from '../models/comandesModel.js';
import Cerveza from '../models/cervezasModel.js';
import Vino from '../models/vinosModel.js';

const modelPerTipus = {
    cerveza: Cerveza,
    vino: Vino
};

export async function createComanda(req, res) {
    try {
        const { items } = req.body;

        if (!Array.isArray(items) || items.length === 0) {
            return res.status(400).json({ error: 'Has d\'enviar un array items amb minim un producte' });
        }

        const itemsNormalitzats = [];
        let total = 0;

        for (const item of items) {
            const { tipus, producteId, quantitat } = item || {};

            if (!tipus || !['cerveza', 'vino'].includes(tipus)) {
                return res.status(400).json({ error: 'Tipus no valid. Usa "cerveza" o "vino"' });
            }

            if (!producteId) {
                return res.status(400).json({ error: 'producteId es obligatori a cada item' });
            }

            if (!Number.isInteger(quantitat) || quantitat < 1) {
                return res.status(400).json({ error: 'La quantitat ha de ser un enter >= 1' });
            }

            const Model = modelPerTipus[tipus];
            const producte = await Model.findById(producteId);

            if (!producte) {
                return res.status(400).json({ error: `Producte no trobat per tipus ${tipus}` });
            }


            if (typeof producte.stock === 'number' && quantitat > producte.stock) {
                return res.status(400).json({
                    error: `Stock insuficient per ${producte.nombre}`,
                    stockDisponible: producte.stock
                });
            }

            const preuUnitari = Number(producte.precio);
            const subtotal = preuUnitari * quantitat;
            total += subtotal;

            itemsNormalitzats.push({
                tipus,
                producteId: producte._id,
                nom: producte.nombre,
                preuUnitari,
                quantitat,
                subtotal
            });
        }

        const comanda = await Comanda.create({
            usuari: req.usuari._id,
            items: itemsNormalitzats,
            total
        });

        res.status(201).json({
            missatge: 'Comanda creada correctament',
            comanda
        });
    } catch (error) {
        res.status(500).json({ error: error.message || 'Error al crear comanda' });
    }
}

export async function getMeComandes(req, res) {
    try {
        const comandes = await Comanda.find({ usuari: req.usuari._id }).sort({ createdAt: -1 });
        res.json({ comandes });
    } catch (error) {
        res.status(500).json({ error: 'Error al obtenir les comandes' });
    }
}
