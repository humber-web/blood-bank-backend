const nodemailer = require('nodemailer');
const { Donor, Notification } = require('../models');
require('dotenv').config();

// Configure the email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE, // e.g., 'Gmail'
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD
  }
});

/**
 * Send an email notification to a donor
 * @param {Object} donor - Donor object containing email and name
 * @param {String} subject - Subject of the email
 * @param {String} message - Body of the email
 */
const sendEmail = async (donor, subject, message) => {
  const mailOptions = {
    from: process.env.EMAIL_USERNAME,
    to: donor.email,
    subject: subject,
    text: `Hello ${donor.first_name},\n\n${message}\n\nBest regards,\nBlood Bank`
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${donor.email}`);
  } catch (error) {
    console.error(`Error sending email to ${donor.email}:`, error);
  }
};

/**
 * Send Anniversary Emails
 */
const sendAnniversaryEmails = async () => {
  try {
    const today = new Date();
    const month = today.getMonth() + 1; // Months are zero-indexed
    const day = today.getDate();

    const donors = await Donor.findAll({
      where: sequelize.where(
        sequelize.fn('EXTRACT', sequelize.literal('MONTH FROM "date_of_birth"')),
        month
      )
    });

    donors.forEach(async (donor) => {
      if (donor.date_of_birth.getDate() === day) {
        const subject = 'Happy Birthday and Thank You!';
        const message = `Dear ${donor.first_name},\n\nHappy Birthday! Thank you for your continued support and donations.\n\nBest wishes,\nBlood Bank`;

        await sendEmail(donor, subject, message);

        // Log Notification
        await Notification.create({
          donor_id: donor.id,
          message: message,
          type: 'Birthday',
          sent_at: new Date()
        });
      }
    });
  } catch (error) {
    console.error('Error sending anniversary emails:', error);
  }
};

module.exports = {
  sendEmail,
  sendAnniversaryEmails
};
