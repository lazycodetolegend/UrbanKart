import Review from '../models/Review.js';
import Order from '../models/Order.js';

export const createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;
    const productId = req.params.productId;

    // Check if user purchased the product
    const order = await Order.findOne({
      user: req.user._id,
      'items.product': productId,
      orderStatus: { $ne: 'Cancelled' },
    });

    if (!order) {
      return res.status(400).json({ success: false, message: 'You must purchase this product to review it' });
    }

    // Check if review already exists
    const existingReview = await Review.findOne({
      user: req.user._id,
      product: productId,
    });

    if (existingReview) {
      return res.status(400).json({ success: false, message: 'You have already reviewed this product' });
    }

    const review = await Review.create({
      user: req.user._id,
      product: productId,
      rating,
      comment,
    });

    res.status(201).json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const updateReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to update this review' });
    }

    review.rating = req.body.rating || review.rating;
    review.comment = req.body.comment || review.comment;

    await review.save();
    res.json({ success: true, review });
  } catch (error) {
    next(error);
  }
};

export const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found' });
    }

    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this review' });
    }

    await review.deleteOne();
    res.json({ success: true, message: 'Review removed' });
  } catch (error) {
    next(error);
  }
};
