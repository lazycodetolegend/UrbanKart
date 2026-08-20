import express from 'express';
import { getStats, getUsers } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.use(protect, admin);

router.get('/stats', getStats);
router.get('/users', getUsers);

export default router;
