// routes/roles.js

const express = require("express");
const router = express.Router();

// Import the Role Controller
const roleController = require("../controllers/roleController");

// Import Authentication and Authorization Middleware
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/authMiddleware");

/**
 * @route   GET /api/roles
 * @desc    Retrieve all roles
 * @access  Admin
 */
router.get(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.getAllRoles
);

/**
 * @route   GET /api/roles/:id
 * @desc    Retrieve a single role by ID
 * @access  Admin
 */
router.get(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.getRoleById
);

/**
 * @route   POST /api/roles
 * @desc    Create a new role
 * @access  Admin
 */
router.post(
  "/",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.createRole
);

/**
 * @route   PUT /api/roles/:id
 * @desc    Update an existing role by ID
 * @access  Admin
 */
router.put(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.updateRole
);

/**
 * @route   DELETE /api/roles/:id
 * @desc    Delete a role by ID
 * @access  Admin
 */
router.delete(
  "/:id",
  authenticateToken,
  authorizeRoles("Admin"),
  roleController.deleteRole
);

module.exports = router;
