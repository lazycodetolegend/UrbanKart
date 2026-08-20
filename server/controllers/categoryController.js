import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

export const getCategories = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ success: true, categories: [] });
    }
    const categories = await Category.find().sort({ name: 1 });
    res.json({ success: true, categories });
  } catch (error) {
    next(error);
  }
};

export const createCategory = async (req, res, next) => {
  try {
    const { name, image, description } = req.body;
    const category = await Category.create({ name, image, description });
    res.status(201).json({ success: true, category });
  } catch (error) {
    next(error);
  }
};

export const updateCategory = async (req, res, next) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (category) {
      res.json({ success: true, category });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const deleteCategory = async (req, res, next) => {
  try {
    // Check if products exist in this category
    const products = await Product.findOne({ category: req.params.id });
    if (products) {
      return res.status(400).json({ success: false, message: 'Cannot delete category with products' });
    }

    const category = await Category.findByIdAndDelete(req.params.id);

    if (category) {
      res.json({ success: true, message: 'Category removed' });
    } else {
      res.status(404).json({ success: false, message: 'Category not found' });
    }
  } catch (error) {
    next(error);
  }
};
