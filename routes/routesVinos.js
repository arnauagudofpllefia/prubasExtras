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

// Llistar vins és públic
routerVino.get("/", getVinosAll);

// La resta del CRUD és només per admin autenticat
routerVino.use(protegir);
routerVino.use(autoritzar('admin'));
routerVino.get("/:id", getVinosById);

routerVino.post("/", upload.single('imatge'), createVino);
routerVino.put("/:id", updateVino);
routerVino.delete("/:id", deleteVino);
routerVino.patch("/:id/imatge", upload.single('imatge'), updateVinoWithImage);

export default routerVino;