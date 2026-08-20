import { check, validationResult } from 'express-validator';

export const registerValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Please enter a password with 6 or more characters').isLength({ min: 6 }),
];

export const loginValidation = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

export const productValidation = [
  check('name', 'Name is required').not().isEmpty(),
  check('description', 'Description is required').not().isEmpty(),
  check('price', 'Price is required and must be numeric').isNumeric(),
  check('category', 'Category is required').not().isEmpty(),
  check('stock', 'Stock is required and must be numeric').isNumeric(),
];

export const runValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }
  next();
};
