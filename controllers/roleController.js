const { Role } = require('../models');
const { validationResult } = require('express-validator');

// Create Role
const createRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const role = await Role.create(req.body);
    res.status(201).json(role);
  } catch (error) {
    next(error);
  }
};

// Get All Roles
const getAllRoles = async (req, res, next) => {
  try {
    const donors = await Role.findAll();
    res.json(donors);
  } catch (error) {
    next(error);
  }
};

// Get Role by ID
const getRoleById = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found.' });
    }
    res.json(role);
  } catch (error) {
    next(error);
  }
};

// Update Role
const updateRole = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found.' });
    }
    await role.update(req.body);
    res.json(role);
  } catch (error) {
    next(error);
  }
};

// Delete Role
const deleteRole = async (req, res, next) => {
  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) {
      return res.status(404).json({ error: 'Role not found.' });
    }
    await role.destroy();
    res.json({ message: 'Role deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createRole,
  getAllRoles,
  getRoleById,
  updateRole,
  deleteRole,
};
