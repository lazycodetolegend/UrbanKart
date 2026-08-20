import User from '../models/User.js';
import bcrypt from 'bcryptjs';

export const updateProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;

      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      updatedUser.password = undefined;

      res.json({ success: true, user: updatedUser });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const addAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses.push(req.body);
      await user.save();
      res.json({ success: true, addresses: user.addresses });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const removeAddress = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.addresses = user.addresses.filter((addr) => addr._id.toString() !== req.params.id);
      await user.save();
      res.json({ success: true, addresses: user.addresses });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const getWishlist = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('wishlist');
    if (user) {
      res.json({ success: true, wishlist: user.wishlist });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};

export const toggleWishlist = async (req, res, next) => {
  try {
    const productId = req.params.productId;
    const user = await User.findById(req.user._id);

    if (user) {
      const index = user.wishlist.indexOf(productId);
      if (index > -1) {
        user.wishlist.splice(index, 1);
      } else {
        user.wishlist.push(productId);
      }
      await user.save();
      res.json({ success: true, wishlist: user.wishlist });
    } else {
      res.status(404).json({ success: false, message: 'User not found' });
    }
  } catch (error) {
    next(error);
  }
};
