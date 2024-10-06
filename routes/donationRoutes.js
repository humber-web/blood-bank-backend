const express = require('express');
const router = express.Router();
const donationController = require('../controllers/donationController');
const { authenticateToken, authorizeRoles } = require('../middleware/authMiddleware');

// Apply authentication middleware
router.use(authenticateToken);

// Assign roles that can access these routes
router.use(authorizeRoles('Admin', 'Doctor'));

// GET /donations
router.get('/', donationController.getAllDonations);

// POST /donations
router.post('/', donationController.createDonation);

// GET /donations/:id
router.get('/:id', donationController.getDonationById);

// PUT /donations/:id
router.put('/:id', donationController.updateDonation);

// DELETE /donations/:id
router.delete('/:id', authorizeRoles('Admin'), donationController.deleteDonation);

module.exports = router;
