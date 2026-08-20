import mongoose from 'mongoose';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

export const register = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database connection is inactive. Please configure MONGO_URI in server/.env with your MongoDB Atlas connection string.'
      });
    }

    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      generateToken(res, user._id);
      user.password = undefined; // Do not return password
      res.status(201).json({ success: true, user });
    } else {
      res.status(400).json({ success: false, message: 'Invalid user data' });
    }
  } catch (error) {
    next(error);
  }
};

export const login = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(500).json({
        success: false,
        message: 'Database connection is inactive. Please configure MONGO_URI in server/.env with your MongoDB Atlas connection string.'
      });
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (user && (await user.comparePassword(password))) {
      generateToken(res, user._id);
      user.password = undefined; // Do not return password
      res.json({ success: true, user });
    } else {
      res.status(401).json({ success: false, message: 'Invalid email or password' });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = (req, res) => {
  res.cookie('token', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.json({ success: true, message: 'Logged out successfully' });
};

export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    res.json({ success: true, user });
  } catch (error) {
    next(error);
  }
};
