const { Donor } = require("../models");
const { Op } = require("sequelize");

module.exports = {
  // Create a new donor
  createDonor: async (req, res) => {
    try {
      const donor = await Donor.create(req.body);
      res.status(201).json(donor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get all donors
  getAllDonors: async (req, res) => {
    try {
      const donors = await Donor.findAll();
      res.status(200).json(donors);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Get a donor by ID
  getDonorById: async (req, res) => {
    try {
      const donor = await Donor.findByPk(req.params.id);
      if (!donor) {
        return res.status(404).json({ error: "Donor not found" });
      }
      res.status(200).json(donor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Update a donor
  updateDonor: async (req, res) => {
    try {
      const [updated] = await Donor.update(req.body, {
        where: { id: req.params.id },
      });
      if (!updated) {
        return res.status(404).json({ error: "Donor not found" });
      }
      const updatedDonor = await Donor.findByPk(req.params.id);
      res.status(200).json(updatedDonor);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete a donor
  deleteDonor: async (req, res) => {
    try {
      const deleted = await Donor.destroy({
        where: { id: req.params.id },
      });
      if (!deleted) {
        return res.status(404).json({ error: "Donor not found" });
      }
      res.status(204).json({ message: "Donor deleted" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // Send Urgent Donation Requests
  sendUrgentRequests: async (req, res) => {
    try {
      const { blood_type } = req.body;
      const donors = await Donor.findAll({ where: { blood_type } });

      donors.forEach((donor) => {
        // Send urgent donation request to donor
        // e.g., sendEmail(donor.email, 'Urgent Donation Needed!', message);
      });

      res.status(200).json({ message: "Urgent requests sent" });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },
  // Search donors by any fields
  searchDonors: async (req, res) => {
    const criteria = req.query;

    const query = {};

    // Build the query based on the provided criteria
    for (const [key, value] of Object.entries(criteria)) {
      if (value) {
        query[key] = { [Op.like]: `%${value}%` };
      }
    }

    try {
      const donors = await Donor.findAll({ where: query });
      res.status(200).json(donors);
    } catch (error) {
      res.status(400).json({ error: "Error searching donors" });
    }
  },
};
