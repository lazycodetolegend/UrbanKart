import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const createOrder = async (req, res, next) => {
  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'No order items' });
    }

    let itemsPrice = 0;

    // Verify prices and calculate
    for (const item of items) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ success: false, message: `Product not found: ${item.product}` });
      }
      if (product.stock < item.qty) {
        return res.status(400).json({ success: false, message: `Not enough stock for ${product.name}` });
      }
      itemsPrice += product.price * item.qty;
      item.price = product.price; // Ensure correct price is used
      item.name = product.name;
    }

    const shippingPrice = itemsPrice >= 500 ? 0 : 40;
    const totalAmount = itemsPrice + shippingPrice;

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalAmount,
    });

    const createdOrder = await order.save();

    // Decrement stock
    for (const item of items) {
      await Product.findByIdAndUpdate(item.product, {
        $inc: { stock: -item.qty },
      });
    }

    res.status(201).json({ success: true, order: createdOrder });
  } catch (error) {
    next(error);
  }
};

export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email');

    if (order) {
      if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
      }
      res.json({ success: true, order });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getAllOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort('-createdAt');
    res.json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

export const updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.orderStatus = req.body.status;
      
      if (req.body.status === 'Delivered') {
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();
      res.json({ success: true, order: updatedOrder });
    } else {
      res.status(404).json({ success: false, message: 'Order not found' });
    }
  } catch (error) {
    next(error);
  }
};
