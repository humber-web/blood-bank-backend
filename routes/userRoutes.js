const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication and authorization middleware
router.use(authenticateToken);
router.use(authorizeRoles('Admin'));

// GET /users
router.get('/', userController.getAllUsers);

// POST /users
router.post('/', userController.createUser);

// GET /users/:id
router.get('/:id', userController.getUserById);

// PUT /users/:id
router.put('/:id', userController.updateUser);

// DELETE /users/:id
router.delete('/:id', userController.deleteUser);

module.exports = router; // Correct export
