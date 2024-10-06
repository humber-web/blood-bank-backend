// controllers/bloodInventoryController.js
const { BloodInventory } = require('../models');
const { validationResult } = require('express-validator');

// Create Blood Inventory
const createBloodInventory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const inventory = await BloodInventory.create(req.body);
    res.status(201).json(inventory);
  } catch (error) {
    next(error);
  }
};

// Get All Blood Inventories
const getAllBloodInventories = async (req, res, next) => {
  try {
    const inventories = await BloodInventory.findAll();
    res.json(inventories);
  } catch (error) {
    next(error);
  }
};

// Get Blood Inventory by ID
const getBloodInventoryById = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ error: 'Blood inventory not found.' });
    }
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

// Update Blood Inventory
const updateBloodInventory = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const inventory = await BloodInventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ error: 'Blood inventory not found.' });
    }
    await inventory.update(req.body);
    res.json(inventory);
  } catch (error) {
    next(error);
  }
};

// Delete Blood Inventory
const deleteBloodInventory = async (req, res, next) => {
  try {
    const inventory = await BloodInventory.findByPk(req.params.id);
    if (!inventory) {
      return res.status(404).json({ error: 'Blood inventory not found.' });
    }
    await inventory.destroy();
    res.json({ message: 'Blood inventory deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBloodInventory,
  getAllBloodInventories,
  getBloodInventoryById,
  updateBloodInventory,
  deleteBloodInventory,
};
