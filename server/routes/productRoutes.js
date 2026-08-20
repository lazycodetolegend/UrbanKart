import express from 'express';
import { getProducts, getFeaturedProducts, getProductById, createProduct, updateProduct, deleteProduct, uploadImages } from '../controllers/productController.js';
import { protect, admin } from '../middleware/auth.js';
import { productValidation, runValidation } from '../middleware/validate.js';
import upload from '../middleware/upload.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/:id', getProductById);
router.post('/', protect, admin, productValidation, runValidation, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);
router.post('/:id/images', protect, admin, upload.array('images', 5), uploadImages);

export default router;
