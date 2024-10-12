// utils/mailer.js
const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST, // e.g., smtp.gmail.com
  port: process.env.EMAIL_PORT, // e.g., 587
  secure: process.env.EMAIL_SECURE === 'true', // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app-specific password
  },
});

// Verify the connection configuration
transporter.verify(function (error, success) {
  if (error) {
    console.error('Error configuring mail transporter:', error);
  } else {
    console.log('Mail transporter is configured correctly.');
  }
});

module.exports = transporter;
