// controllers/appointmentController.js
const { Appointment, User, Donor } = require('../models');
const { validationResult } = require('express-validator');

// Create Appointment
const createAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const { donorId, bloodType, appointmentDate, time } = req.body;
    const appointment = await Appointment.create({
      userId: req.user.id,
      donorId,
      bloodType,
      appointmentDate,
      time,
      status: 'Scheduled',
    });
    res.status(201).json(appointment);
  } catch (error) {
    next(error);
  }
};

// Get All Appointments - Admin Only
const getAllAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Donor, as: 'donor', attributes: ['id', 'firstName', 'lastName', 'bloodType'] },
      ],
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// Get User's Appointments
const getUserAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.findAll({
      where: { userId: req.user.id },
      include: [
        { model: Donor, as: 'donor', attributes: ['id', 'firstName', 'lastName', 'bloodType'] },
      ],
    });
    res.json(appointments);
  } catch (error) {
    next(error);
  }
};

// Get Appointment by ID
const getAppointmentById = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
        { model: Donor, as: 'donor', attributes: ['id', 'firstName', 'lastName', 'bloodType'] },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    // If not admin, ensure the appointment belongs to the user
    if (req.user.role !== 'Admin' && appointment.userId !== req.user.id) {
      return res.status(403).json({ error: 'Access denied.' });
    }
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// Update Appointment - Admin Only
const updateAppointment = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    await appointment.update(req.body);
    res.json(appointment);
  } catch (error) {
    next(error);
  }
};

// Delete Appointment - Admin Only
const deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    await appointment.destroy();
    res.json({ message: 'Appointment deleted successfully.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createAppointment,
  getAllAppointments,
  getUserAppointments,
  getAppointmentById,
  updateAppointment,
  deleteAppointment,
};
