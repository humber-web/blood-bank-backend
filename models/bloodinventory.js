'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class BloodInventory extends Model {
    static associate(models) {
      // Define associations here if needed
    }
  }

  BloodInventory.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      bloodType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'blood_type',
        validate: {
          isIn: [['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']],
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          min: 0,
        },
      },
      location: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'BloodInventory',
      tableName: 'BloodInventories',
      underscored: true,
      timestamps: true,
    }
  );

  return BloodInventory;
};
