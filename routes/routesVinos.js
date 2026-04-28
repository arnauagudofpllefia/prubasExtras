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

// GET: qualsevol usuari autenticat
routerVino.get("/", protegir, getVinosAll);
routerVino.get("/:id", protegir, getVinosById);

// POST, PUT, DELETE, PATCH: només rol 'admin'
routerVino.post("/", protegir, autoritzar('admin'), upload.single('imatge'), createVino);
routerVino.put("/:id", protegir, autoritzar('admin'), updateVino);
routerVino.delete("/:id", protegir, autoritzar('admin'), deleteVino);
routerVino.patch("/:id/imatge", protegir, autoritzar('admin'), upload.single('imatge'), updateVinoWithImage);

export default routerVino;