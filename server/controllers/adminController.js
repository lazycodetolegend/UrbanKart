import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();

    const salesData = await Order.aggregate([
      { $match: { orderStatus: 'Delivered' } },
      { $group: { _id: null, totalSales: { $sum: '$totalAmount' } } },
    ]);
    const totalSales = salesData.length > 0 ? salesData[0].totalSales : 0;

    const bestSelling = await Order.aggregate([
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalQty: { $sum: '$items.qty' },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 5 },
    ]);

    const lowStock = await Product.find({ stock: { $lte: 5 } }).select('name stock');

    res.json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalSales,
        bestSelling,
        lowStock,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).select('-password').sort('-createdAt');
    res.json({ success: true, users });
  } catch (error) {
    next(error);
  }
};
