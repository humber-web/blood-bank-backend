'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Donor extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  Donor.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'first_name',
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'last_name',
      },
      bloodType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'blood_type',
      },
      age: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      dateOfBirth: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'date_of_birth',
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Donor',
      tableName: 'Donors',
      underscored: true,
      timestamps: true,
    }
  );

  return Donor;
};