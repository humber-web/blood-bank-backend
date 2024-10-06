'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Appointment extends Model {
    static associate(models) {
      Appointment.belongsTo(models.User, { foreignKey: 'user_id', as: 'user' });
      Appointment.belongsTo(models.Donor, { foreignKey: 'donor_id', as: 'donor' });
    }
  }

  Appointment.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      userId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'user_id',
      },
      donorId: {
        type: DataTypes.UUID,
        allowNull: false,
        field: 'donor_id',
      },
      bloodType: {
        type: DataTypes.STRING,
        allowNull: false,
        field: 'blood_type',
        validate: {
          isIn: [['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']],
        },
      },
      appointmentDate: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        field: 'appointment_date',
      },
      time: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'Scheduled',
        validate: {
          isIn: [['Scheduled', 'Completed', 'Cancelled']],
        },
      },
    },
    {
      sequelize,
      modelName: 'Appointment',
      tableName: 'Appointments',
      underscored: true,
      timestamps: true,
    }
  );

  return Appointment;
};
