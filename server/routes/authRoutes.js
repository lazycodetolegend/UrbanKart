import express from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';
import { registerValidation, loginValidation, runValidation } from '../middleware/validate.js';

const router = express.Router();

router.post('/register', registerValidation, runValidation, register);
router.post('/login', loginValidation, runValidation, login);
router.post('/logout', protect, logout);
router.get('/me', protect, getMe);

export default router;
