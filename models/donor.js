'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donor = sequelize.define(
    'Donor',
    {
      id: {
        type: DataTypes.INTEGER, // Changed to INTEGER to match migration
        autoIncrement: true,     // Added autoIncrement to match migration
        primaryKey: true,
      },
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      email: DataTypes.STRING,
      phone_number: DataTypes.STRING,
      blood_type: DataTypes.STRING,
      date_of_birth: DataTypes.DATE,
      last_donation_date: DataTypes.DATE,
    },
    {
      tableName: 'Donors',    // Set tableName to match migration
      freezeTableName: true,  // Prevent Sequelize from pluralizing
      underscored: false,     // Set to false if your columns use camelCase
    }
  );
  Donor.associate = function (models) {
    Donor.hasMany(models.Donation, { foreignKey: 'donor_id' });
  };
  return Donor;
};
