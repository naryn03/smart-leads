import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { registerValidation, loginValidation } from '../middleware/validation';
import { authenticate } from '../middleware/auth';

const router = Router();

router.post('/register', registerValidation, register);
router.post('/login', loginValidation, login);
router.get('/me', authenticate, getMe);

export default router;
