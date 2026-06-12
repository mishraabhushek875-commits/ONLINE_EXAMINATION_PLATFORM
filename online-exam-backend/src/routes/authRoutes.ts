import { Router } from 'express';
import { authController } from '../controllers/authController';

const router = Router();

// Register Route: POST http://localhost:5000/api/auth/register [cite: 14, 16]
router.post('/register', authController.register);

// Login Route: POST http://localhost:5000/api/auth/login [cite: 14, 17]
router.post('/login', authController.login);

export default router;