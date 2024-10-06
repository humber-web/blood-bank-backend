// seeders/YYYYMMDDHHMMSS-create-admin-user.js

'use strict';
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch Admin Role ID
    const roles = await queryInterface.sequelize.query(
      `SELECT id FROM "Roles" WHERE name = 'Admin';`
    );
    const adminRoleId = roles[0][0].id;

    // Create Admin User
    await queryInterface.bulkInsert('Users', [
      {
        id: uuidv4(),
        username: 'admin',
        email: 'admin@bloodbank.com',
        password: await bcrypt.hash('adminpassword', 10),
        role_id: adminRoleId,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', { email: 'admin@bloodbank.com' }, {});
  },
};
