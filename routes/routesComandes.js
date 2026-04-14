import express from 'express';
import { protegir } from '../middlewares/authMiddleware.js';
import { createComanda, getMeComandes } from '../controllers/comandesController.js';

const routerComandes = express.Router();

routerComandes.use(protegir);
routerComandes.post('/', createComanda);
routerComandes.get('/me', getMeComandes);

export default routerComandes;
