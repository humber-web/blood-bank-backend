'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Donors', 'date_of_birth', {
      type: Sequelize.DATEONLY,
      allowNull: false,
      defaultValue: '2000-01-01', // Provide a default value
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Donors', 'date_of_birth');
  },
};