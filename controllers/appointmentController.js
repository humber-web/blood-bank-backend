// controllers/appointmentController.js
const { Appointment, User, Donor } = require('../models');
const { validationResult } = require('express-validator');
const transporter = require('../utils/mailer');

const sendAppointmentEmail = async (user, donor, appointment, action) => {
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: user.email,
    subject: `Appointment ${action}: ${appointment.bloodType} Blood Donation`,
    text: `
      Hello ${user.username},

      Your appointment for blood donation has been ${action.toLowerCase()}.

      Details:
      Donor: ${donor.firstName} ${donor.lastName}
      Blood Type: ${appointment.bloodType}
      Date: ${appointment.appointmentDate}
      Time: ${appointment.time}
      Status: ${appointment.status}

      Thank you for donating blood!

      Best regards,
      Blood Bank Team
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Appointment ${action} email sent to ${user.email}`);
  } catch (error) {
    console.error('Error sending appointment email:', error);
  }
};

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

    // Fetch user and donor details
    const user = await User.findByPk(req.user.id);
    const donor = await Donor.findByPk(donorId);

    // Send email notification
    await sendAppointmentEmail(user, donor, appointment, 'Scheduled');

    res.status(201).json(appointment);
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
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        { model: User, as: 'user' },
        { model: Donor, as: 'donor' },
      ],
    });
    if (!appointment) {
      return res.status(404).json({ error: 'Appointment not found.' });
    }
    await appointment.update(req.body);

    // Send email notification if status changes
    if (req.body.status) {
      await sendAppointmentEmail(appointment.user, appointment.donor, appointment, req.body.status);
    }

    res.json(appointment);
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
