import express from 'express';
import { protegir, autoritzar } from '../middlewares/authMiddleware.js';
import upload from '../config/multer.js';
import {
  getCervezas,
  getCervezaById,
  createCerveza,
  updateCerveza,
  deleteCerveza,
  updateCervezaWithImage
} from '../controllers/cervezasController.js';

const router = express.Router();

// Primer middleware: totes les rutes requereixen token vàlid (req.usuari definit)
router.use(protegir);
router.use(autoritzar('admin'));

// CRUD complet: només rol 'admin'
router.get('/', getCervezas);
router.get('/:id', getCervezaById);

router.post('/', upload.single('imatge'), createCerveza);
router.put('/:id', updateCerveza);
router.delete('/:id', deleteCerveza);
router.patch('/:id/imatge', upload.single('imatge'), updateCervezaWithImage);

export default router;