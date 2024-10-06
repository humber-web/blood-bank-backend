// routes/bloodInventoryRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const bloodInventoryController = require('../controllers/bloodInventoryController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Create Blood Inventory - Admin Only
router.post(
  '/',
  authenticateToken,
  authorizeRoles('Admin'),
  [
    body('bloodType')
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type.'),
    body('quantity')
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer.'),
    body('location')
      .notEmpty()
      .withMessage('Location is required.')
      .trim()
      .escape(),
  ],
  bloodInventoryController.createBloodInventory
);

// Get All Blood Inventories - Admin and User
router.get(
  '/',
  authenticateToken,
  authorizeRoles('Admin', 'User'),
  bloodInventoryController.getAllBloodInventories
);

// Get Blood Inventory by ID - Admin and User
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin', 'User'),
  bloodInventoryController.getBloodInventoryById
);

// Update Blood Inventory - Admin Only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin'),
  [
    body('bloodType')
      .optional()
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type.'),
    body('quantity')
      .optional()
      .isInt({ min: 0 })
      .withMessage('Quantity must be a non-negative integer.'),
    body('location')
      .optional()
      .notEmpty()
      .withMessage('Location cannot be empty.')
      .trim()
      .escape(),
  ],
  bloodInventoryController.updateBloodInventory
);

// Delete Blood Inventory - Admin Only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin'),
  bloodInventoryController.deleteBloodInventory
);

module.exports = router;
