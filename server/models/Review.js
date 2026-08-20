import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Product',
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

reviewSchema.index({ user: 1, product: 1 }, { unique: true });

reviewSchema.statics.calculateAverageRating = async function (productId) {
  const obj = await this.aggregate([
    {
      $match: { product: productId },
    },
    {
      $group: {
        _id: '$product',
        avgRating: { $avg: '$rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  try {
    await this.model('Product').findByIdAndUpdate(productId, {
      avgRating: obj[0]?.avgRating || 0,
      numReviews: obj[0]?.numReviews || 0,
    });
  } catch (err) {
    console.error(err);
  }
};

reviewSchema.post('save', async function () {
  await this.constructor.calculateAverageRating(this.product);
});

reviewSchema.post('deleteOne', { document: true, query: false }, async function () {
  await this.constructor.calculateAverageRating(this.product);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
