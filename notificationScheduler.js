const cron = require('node-cron');
const { Donor } = require('./models');
// Import your notification service (e.g., email or SMS sender)

cron.schedule('0 9 * * *', async () => {
  // Runs every day at 9:00 AM
  const today = new Date();

  // Send Anniversary Notifications
  const donors = await Donor.findAll();
  donors.forEach((donor) => {
    if (
      donor.last_donation_date &&
      donor.last_donation_date.getDate() === today.getDate() &&
      donor.last_donation_date.getMonth() === today.getMonth()
    ) {
      // Send anniversary notification to donor
      // e.g., sendEmail(donor.email, 'Happy Donation Anniversary!', message);
    }
  });

  // Send Donation Reminders
  donors.forEach((donor) => {
    const nextEligibleDate = new Date(donor.last_donation_date);
    nextEligibleDate.setMonth(nextEligibleDate.getMonth() + 3); // Assuming 3 months eligibility
    if (
      nextEligibleDate.getDate() === today.getDate() &&
      nextEligibleDate.getMonth() === today.getMonth()
    ) {
      // Send reminder notification to donor
    }
  });
});
