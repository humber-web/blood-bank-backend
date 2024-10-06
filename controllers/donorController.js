// controllers/donorController.js
const { Donor } = require('../models');
const { validationResult } = require('express-validator');

// Create Donor
const createDonor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const donor = await Donor.create(req.body);
    res.status(201).json(donor);
  } catch (error) {
    next(error);
  }
};

// Get All Donors
const getAllDonors = async (req, res, next) => {
  try {
    const donors = await Donor.findAll();
    res.json(donors);
  } catch (error) {
    next(error);
  }
};

// Get Donor by ID
const getDonorById = async (req, res, next) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found.' });
    }
    res.json(donor);
  } catch (error) {
    next(error);
  }
};

// Update Donor
const updateDonor = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found.' });
    }
    await donor.update(req.body);
    res.json(donor);
  } catch (error) {
    next(error);
  }
};

// Delete Donor
const deleteDonor = async (req, res, next) => {
  try {
    const donor = await Donor.findByPk(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found.' });
    }
    await donor.destroy();
    res.json({ message: 'Donor deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createDonor,
  getAllDonors,
  getDonorById,
  updateDonor,
  deleteDonor,
};
