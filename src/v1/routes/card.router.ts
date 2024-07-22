import { Router } from 'express';
import { getCardData, getHomeData } from '../controllers/card.controller';

const router = Router();
router.get('/', getHomeData);
router.get('/p/:number', getHomeData);
router.get('/g/:number', getCardData);

export default router;