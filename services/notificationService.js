// services/notificationService.js
const { Donor, Notification, sequelize } = require('../models');
const cron = require('node-cron');
const transporter = require('../utils/mailer'); // Import the transporter
const fs = require('fs');
const path = require('path');
const handlebars = require('handlebars');
require('dotenv').config();

/**
 * Send an email notification to a donor
 * @param {Object} donor - Donor object containing email and name
 * @param {String} subject - Subject of the email
 * @param {String} templateName - Name of the template file
 * @param {Object} context - Context for the template
 */
const sendEmail = async (donor, subject, templateName, context) => {
  try {
    console.log(`Preparing to send email to ${donor.email} with template ${templateName}`);

    const templatePath = path.join(__dirname, '..', 'templates', `${templateName}.html`);
    const templateSource = fs.readFileSync(templatePath, 'utf8');
    const template = handlebars.compile(templateSource);
    const html = template(context);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: donor.email,
      subject: subject,
      html: html
    };

    console.log(`Sending email to ${donor.email} with subject "${subject}"`);
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
      ),
    });

    if (!donors || donors.length === 0) {
      console.log('No anniversaries today.');
      return;
    }

    console.log(`Found ${donors.length} donor(s) with anniversaries today.`);

    for (const donor of donors) {
      const donorBirthDate = new Date(donor.dateOfBirth);
      console.log('Donor:', donorBirthDate.getDate())
      console.log('Donor:', donorBirthDate)
      console.log('Today:', day)
      if (donorBirthDate.getDate() !== (day - 1)) {
        continue; // Skip if the day doesn't match
      }

      const subject = 'Happy Anniversary and Thank You!';
      const context = {
        user: {
          firstName: donor.firstName,
        },
        websiteUrl: 'http://localhost:3000/dashboard', // Replace with your website URL
      };

      await sendEmail(donor, subject, 'anniversaryTemplate', context);

      // Log Notification
      // await Notification.create({
      //   donorId: donor.id,
      //   message: `Sent anniversary email to ${donor.email}`,
      //   type: 'Anniversary',
      //   sentAt: new Date(),
      // });
    }

    console.log('All anniversary emails have been processed.');
  } catch (error) {
    console.error('Error sending anniversary emails:', error);
    // Optionally, notify administrators or log to a monitoring service
  }
};

// Schedule the job to run every day at 9 AM in the specified timezone
cron.schedule('0 9 * * *', () => {
  console.log('Running sendAnniversaryEmails job');
  sendAnniversaryEmails();
}, {
  timezone: 'Atlantic/Cape_Verde', // Replace with your desired timezone
});

module.exports = {
  sendEmail,
  sendAnniversaryEmails
};