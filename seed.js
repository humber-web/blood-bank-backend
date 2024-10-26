// seed.js
'use strict';

const { faker } = require('@faker-js/faker'); // Updated import
const { Donor, sequelize } = require('./models'); // Adjust the path if necessary

// Configuration
const TOTAL_DONORS = 10000;
const BATCH_SIZE = 1000; // Number of records to insert per batch

// Blood types
const BLOOD_TYPES = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

// Function to generate a single donor
const generateDonor = () => {
  const firstName = faker.person.firstName(); // Updated method
  const lastName = faker.person.lastName();   // Updated method
  const bloodType = faker.helpers.arrayElement(BLOOD_TYPES); // Updated method
  const age = faker.number.int({ min: 18, max: 65 }); // Updated method

  // Calculate dateOfBirth based on age
  const currentYear = new Date().getFullYear();
  const birthYear = currentYear - age;
  const dateOfBirth = faker.date.between({ from: `${birthYear}-01-01`, to: `${birthYear}-12-31` }); // Updated method

  const phone = faker.phone.number(); // Ensure this method is correct
  const email = faker.internet.email(firstName, lastName).toLowerCase();
  const address = `${faker.address.streetAddress()}, ${faker.address.city()}, ${faker.address.country()}`;

  return {
    firstName,
    lastName,
    bloodType,
    age,
    dateOfBirth: dateOfBirth.toISOString().split('T')[0], // Format as 'YYYY-MM-DD'
    phone,
    email,
    address,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Async function to perform seeding
const seedDonors = async () => {
  try {
    console.log('Starting donor seeding...');

    // Authenticate the connection
    await sequelize.authenticate();
    console.log('Database connection established.');

    // Optionally, sync the model (creates table if not exists)
    // Be cautious: 'force: true' drops the table if it exists
    // await sequelize.sync({ force: false });

    let donors = [];

    for (let i = 1; i <= TOTAL_DONORS; i++) {
      donors.push(generateDonor());

      // Insert in batches
      if (i % BATCH_SIZE === 0) {
        console.log(`Generating batch ${i / BATCH_SIZE} (${i} donors)...`);
        await Donor.bulkCreate(donors, { ignoreDuplicates: true });
        console.log(`Inserted batch ${i / BATCH_SIZE}.`);
        donors = []; // Reset donors array
      }
    }

    // Insert any remaining donors
    if (donors.length > 0) {
      console.log(`Inserting final batch (${donors.length} donors)...`);
      await Donor.bulkCreate(donors, { ignoreDuplicates: true });
      console.log('Final batch inserted.');
    }

    console.log(`Successfully seeded ${TOTAL_DONORS} donors.`);
    process.exit(0); // Exit the script
  } catch (error) {
    console.error('Error seeding donors:', error);
    process.exit(1); // Exit with failure
  }
};

// Execute the seeding function
seedDonors();
