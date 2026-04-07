import express from 'express';
import { 
    getVinosAll, 
    getVinosById, 
    createVino, 
    updateVino, 
    deleteVino 
} from "../controllers/vinosController.js";

const routerVino = express.Router();

routerVino.get("/", getVinosAll);

routerVino.post("/", createVino);

routerVino.get("/:id", getVinosById);

routerVino.put("/:id", updateVino);

routerVino.delete("/:id", deleteVino);

export default routerVino;