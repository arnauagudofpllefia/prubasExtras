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

// Rutes de lectura: qualsevol usuari autenticat (rol usuari o admin) pot accedir
router.get('/', getCervezas);
router.get('/:id', getCervezaById);

// Rutes d'escriptura: només rol 'admin'; autoritzar('admin') comprova req.usuari.rol abans del controlador
router.post('/', autoritzar('admin'), createCerveza);
router.put('/:id', autoritzar('admin'), updateCerveza);
router.delete('/:id', autoritzar('admin'), deleteCerveza);
router.patch('/:id/imatge', autoritzar('admin'), upload.single('imatge'), updateCervezaWithImage);

export default router;