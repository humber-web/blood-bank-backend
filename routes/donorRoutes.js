const express = require('express');
const router = express.Router();
const donorController = require('../controllers/donorController');

// Search for donors
router.get('/search', donorController.searchDonors);

router.post('/', donorController.createDonor);
router.get('/', donorController.getAllDonors);
router.get('/:id', donorController.getDonorById);
router.put('/:id', donorController.updateDonor);
router.delete('/:id', donorController.deleteDonor);
router.post('/urgent', donorController.sendUrgentRequests);


module.exports = router;
