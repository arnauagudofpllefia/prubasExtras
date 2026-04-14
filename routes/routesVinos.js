import express from 'express';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';
import {
    getVinosAll,
    getVinosById,
    createVino,
    updateVino,
    deleteVino,
    updateVinoWithImage
} from "../controllers/vinosController.js";

const routerVino = express.Router();

// Primer middleware: totes les rutes requereixen token vàlid (req.usuari definit)
routerVino.use(protegir);
routerVino.use(autoritzar('admin'));

// CRUD complet: només rol 'admin'
routerVino.get("/", getVinosAll);
routerVino.get("/:id", getVinosById);

routerVino.post("/", upload.single('imatge'), createVino);
routerVino.put("/:id", updateVino);
routerVino.delete("/:id", deleteVino);
routerVino.patch("/:id/imatge", upload.single('imatge'), updateVinoWithImage);

export default routerVino;