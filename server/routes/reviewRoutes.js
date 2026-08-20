import express from 'express';
import { createReview, updateReview, deleteReview } from '../controllers/reviewController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/:productId', createReview);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);

export default router;
