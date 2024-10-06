// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { body } = require('express-validator');

// User Registration
router.post(
  '/register',
  [
    body('username')
      .isLength({ min: 4, max: 20 })
      .withMessage('Username must be between 4 and 20 characters.'),
    body('email').isEmail().withMessage('Enter a valid email.'),
    body('password')
      .isLength({ min: 6 })
      .withMessage('Password must be at least 6 characters.'),
    body('role')
      .optional()
      .isIn(['User', 'Admin', 'Doctor'])
      .withMessage('Invalid role.'),
  ],
  authController.register
);

// User Login
router.post(
  '/login',
  [
    body('email').isEmail().withMessage('Enter a valid email.'),
    body('password').notEmpty().withMessage('Password is required.'),
  ],
  authController.login
);

module.exports = router;
