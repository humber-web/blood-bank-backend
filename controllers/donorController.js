// controllers/donorController.js
const { Donor } = require('../models');
const { validationResult } = require('express-validator');
const { Op } = require('sequelize'); 

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

// controllers/donorController.js

// Get All Donors with Pagination and Search
const getAllDonors = async (req, res, next) => {
  try {
    // Extract query parameters with default values
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Records per page
    const search = req.query.search || ''; // Search term

    const offset = (page - 1) * limit;

    // Build the 'where' condition for search
    const whereCondition = search
      ? {
          [Op.or]: [
            { firstName: { [Op.iLike]: `%${search}%` } }, // Case-insensitive
            { lastName: { [Op.iLike]: `%${search}%` } },
            { email: { [Op.iLike]: `%${search}%` } },
            { phone: { [Op.iLike]: `%${search}%` } },
            { bloodType: { [Op.iLike]: `%${search}%` } },
          ],
        }
      : {};

    // Fetch donors with pagination and search
    const { rows: donors, count } = await Donor.findAndCountAll({
      where: whereCondition,
      limit,
      offset,
      order: [['createdAt', 'DESC']], // Optional: Order by creation date
    });

    // Calculate total pages
    const totalPages = Math.ceil(count / limit);

    res.status(200).json({
      data: donors,
      currentPage: page,
      totalPages,
      totalRecords: count,
    });
  } catch (error) {
    console.error('Error fetching donors:', error);
    res.status(500).json({ message: 'Server Error: Unable to fetch donors.' });
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
