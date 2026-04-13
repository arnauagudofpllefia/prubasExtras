import express from 'express';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import {
    getVinosAll,
    getVinosById,
    createVino,
    updateVino,
    deleteVino
} from "../controllers/vinosController.js";

const routerVino = express.Router();

// Primer middleware: totes les rutes requereixen token vàlid (req.usuari definit)
routerVino.use(protegir);

// Rutes de lectura: qualsevol usuari autenticat (rol usuari o admin) pot accedir
routerVino.get("/", getVinosAll);
routerVino.get("/:id", getVinosById);

// Rutes d'escriptura: només rol 'admin'; autoritzar('admin') comprova req.usuari.rol abans del controlador
routerVino.post("/", autoritzar('admin'), createVino);
routerVino.put("/:id", autoritzar('admin'), updateVino);
routerVino.delete("/:id", autoritzar('admin'), deleteVino);

export default routerVino;