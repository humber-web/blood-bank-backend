// routes/appointmentRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const appointmentController = require('../controllers/appointmentController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Create Appointment - Users
router.post(
  '/',
  authenticateToken,
  authorizeRoles('User', 'Admin'),
  [
    body('donorId')
      .isUUID()
      .withMessage('Invalid donor ID.'),
    body('bloodType')
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type.'),
    body('appointmentDate')
      .isISO8601()
      .withMessage('Invalid appointment date.'),
    body('time')
      .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Invalid time format. Use HH:MM in 24-hour format.'),
  ],
  appointmentController.createAppointment
);

// Get All Appointments - Admin Only
router.get(
  '/',
  authenticateToken,
  authorizeRoles('Admin'),
  appointmentController.getAllAppointments
);

// Get User's Appointments - Users
router.get(
  '/my',
  authenticateToken,
  authorizeRoles('User', 'Admin'),
  appointmentController.getUserAppointments
);

// Get Appointment by ID - Admin and Owner
router.get(
  '/:id',
  authenticateToken,
  authorizeRoles('User', 'Admin'),
  appointmentController.getAppointmentById
);

// Update Appointment - Admin Only
router.put(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin'),
  [
    body('donorId')
      .optional()
      .isUUID()
      .withMessage('Invalid donor ID.'),
    body('bloodType')
      .optional()
      .isIn(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
      .withMessage('Invalid blood type.'),
    body('appointmentDate')
      .optional()
      .isISO8601()
      .withMessage('Invalid appointment date.'),
    body('time')
      .optional()
      .matches(/^([0-1]\d|2[0-3]):([0-5]\d)$/)
      .withMessage('Invalid time format. Use HH:MM in 24-hour format.'),
    body('status')
      .optional()
      .isIn(['Scheduled', 'Completed', 'Cancelled'])
      .withMessage('Invalid status.'),
  ],
  appointmentController.updateAppointment
);

// Delete Appointment - Admin Only
router.delete(
  '/:id',
  authenticateToken,
  authorizeRoles('Admin'),
  appointmentController.deleteAppointment
);

module.exports = router;
