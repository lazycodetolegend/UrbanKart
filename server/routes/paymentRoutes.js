import express from 'express';
import { createRazorpayOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.post('/razorpay/order', createRazorpayOrder);
router.post('/razorpay/verify', verifyPayment);

export default router;
