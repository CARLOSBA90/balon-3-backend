import { Router } from 'express';
import { login, newUser } from '../controllers/user.controller';

const router = Router();

router.post('/', newUser);
router.post('/login', login);

export default router;