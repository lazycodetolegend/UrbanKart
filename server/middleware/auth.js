import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded.id).select('-password');
    if (!req.user) {
      res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    next();
  } catch (error) {
    res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
    return res.status(401).json({ success: false, message: 'Session expired, please login again' });
  }
};

export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Not authorized as an admin' });
  }
};
