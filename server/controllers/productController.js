import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';

export const getProducts = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, products: [], page: 1, pages: 1, total: 0 });
    }

    const { search, category, minPrice, maxPrice, sort, page = 1, limit = 12 } = req.query;

    const query = {};

    // Search by product name (regex fallback if text index not available)
    if (search) {
      query.name = { $regex: search, $options: 'i' };
    }

    // Filter by category name — resolve to ObjectId
    if (category && category !== 'All') {
      const categoryDoc = await Category.findOne({ name: { $regex: new RegExp(`^${category}$`, 'i') } });
      if (categoryDoc) {
        query.category = categoryDoc._id;
      }
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    let sortOption = {};
    if (sort === 'price') sortOption.price = 1;
    else if (sort === '-price') sortOption.price = -1;
    else if (sort === '-avgRating') sortOption.avgRating = -1;
    else if (sort === '-createdAt') sortOption.createdAt = -1;
    else sortOption.createdAt = -1;

    const skip = (Number(page) - 1) * Number(limit);

    const products = await Product.find(query)
      .sort(sortOption)
      .skip(skip)
      .limit(Number(limit))
      .populate('category', 'name');

    const total = await Product.countDocuments(query);

    res.json({
      success: true,
      products,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      total,
    });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, products: [] });
    }
    const products = await Product.find({ featured: true }).limit(8).populate('category', 'name');
    res.json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    
    if (product) {
      // We will also get reviews separately or populate here if we linked them, 
      // but reviews are linked to product, so we can fetch them here.
      // Since it's a separate model, let's fetch it.
      const mongoose = await import('mongoose');
      const Review = mongoose.model('Review');
      const reviews = await Review.find({ product: product._id }).populate('user', 'name');
      
      const productObj = product.toObject();
      productObj.reviews = reviews;
      
      res.json({ success: true, product: productObj });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = new Product(req.body);
    const createdProduct = await product.save();
    res.status(201).json({ success: true, product: createdProduct });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (product) {
      res.json({ success: true, product });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (product) {
      res.json({ success: true, message: 'Product removed' });
    } else {
      res.status(404).json({ success: false, message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const uploadImages = async (req, res, next) => {
  try {
    // Assuming multer is configured and attached multiple files
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ success: false, message: 'No files uploaded' });
    }
    
    const imageUrls = req.files.map(file => `/uploads/${file.filename}`);
    res.json({ success: true, images: imageUrls });
  } catch (error) {
    next(error);
  }
};
