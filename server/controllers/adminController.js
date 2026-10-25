import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';

export const getStats = async (req, res, next) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalOrders = await Order.countDocuments();
    const totalProducts = await Product.countDocuments();

    // Calculate total sales from non-cancelled orders (or delivered orders)
    const salesData = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'Cancelled' } } },
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
          sold: { $sum: '$items.qty' },
        },
      },
      { $sort: { totalQty: -1 } },
      { $limit: 6 },
    ]);

    const lowStock = await Product.find({ stock: { $lte: 100 } })
      .select('name stock price category images')
      .populate('category', 'name')
      .sort('stock')
      .limit(8);

    const statsObj = {
      totalUsers,
      totalOrders,
      totalProducts,
      totalSales,
      bestSelling,
      lowStock,
    };

    res.json({
      success: true,
      stats: statsObj,
      ...statsObj,
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
