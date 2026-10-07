import { Router } from 'express';
import { register, login, getMe } from '../controllers/authController';
import { validateRegisterInput, validateLoginInput } from '../validators/authValidators';
import { authenticate } from '../middleware/auth';

const router = Router();

// Public routes
router.post('/register', validateRegisterInput, register);
router.post('/login', validateLoginInput, login);

// Protected routes
router.get('/me', authenticate, getMe);

export default router;
