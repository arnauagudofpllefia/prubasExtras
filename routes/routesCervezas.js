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

// GET: qualsevol usuari autenticat
router.get('/', protegir, getCervezas);
router.get('/:id', protegir, getCervezaById);

// POST, PUT, DELETE, PATCH: només rol 'admin'
router.post('/', protegir, autoritzar('admin'), upload.single('imatge'), createCerveza);
router.put('/:id', protegir, autoritzar('admin'), updateCerveza);
router.delete('/:id', protegir, autoritzar('admin'), deleteCerveza);
router.patch('/:id/imatge', protegir, autoritzar('admin'), upload.single('imatge'), updateCervezaWithImage);

export default router;