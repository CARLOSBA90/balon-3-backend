import { Router } from 'express';
import { getCards } from '../controllers/card.controller';
import validateToken from '../middleware/validate.token';


const router = Router();

router.get('/', getCards);

router.get('/test', validateToken, getCards);


export default router;