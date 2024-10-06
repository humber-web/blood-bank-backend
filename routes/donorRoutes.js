// routes/donorRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const donorController = require('../controllers/donorController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Create Donor - Admin User Only
router.post(
  '/',
  authenticateToken,
  authorizeRoles('Admin', 'User'),
  [
    body('firstName').isLength({ min: 2 }).withMessage('First name is required.'),
    body('lastName').isLength({ min: 2 }).withMessage('Last name is required.'),
    body('bloodType').isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type.'),
    body('age').isInt({ min: 18 }).withMessage('Age must be at least 18.'),
    body('phone').isMobilePhone().withMessage('Invalid phone number.'),
    body('email').isEmail().withMessage('Invalid email address.'),
    body('address').notEmpty().withMessage('Address is required.'),
  ],
  donorController.createDonor
);

// Get All Donors - Admin and User
router.get(
  '/',
  authenticateToken,
  authorizeRoles('Admin', 'User'),
  donorController.getAllDonors
);

// Get Donor by ID - Admin and User
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin', 'User'),
  donorController.getDonorById
);

// Update Donor - Admin Only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin', 'User'),
  [
    body('firstName').optional().isLength({ min: 2 }).withMessage('First name is too short.'),
    body('lastName').optional().isLength({ min: 2 }).withMessage('Last name is too short.'),
    body('bloodType').optional().isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']).withMessage('Invalid blood type.'),
    body('age').optional().isInt({ min: 18 }).withMessage('Age must be at least 18.'),
    body('phone').optional().isMobilePhone('cv-CV').withMessage('Invalid phone number.'), // Specify Cape Verde locale
    body('email').optional().isEmail().withMessage('Invalid email address.'),
    body('address').optional().notEmpty().withMessage('Address cannot be empty.'),
  ],
  donorController.updateDonor
);

// Delete Donor - Admin Only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin', 'User'),
  donorController.deleteDonor
);

module.exports = router;
