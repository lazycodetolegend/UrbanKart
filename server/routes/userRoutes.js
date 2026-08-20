import express from 'express';
import { updateProfile, addAddress, removeAddress, getWishlist, toggleWishlist } from '../controllers/userController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.use(protect);

router.put('/profile', updateProfile);
router.put('/address', addAddress);
router.delete('/address/:id', removeAddress);
router.get('/wishlist', getWishlist);
router.post('/wishlist/:productId', toggleWishlist);

export default router;
