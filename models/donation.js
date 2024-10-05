'use strict';
module.exports = (sequelize, DataTypes) => {
  const Donation = sequelize.define(
    'Donation',
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      donor_id: DataTypes.UUID,
      donation_date: DataTypes.DATE,
    },
    {
      underscored: true,
    }
  );
  Donation.associate = function (models) {
    Donation.belongsTo(models.Donor, { foreignKey: 'donor_id' });
  };
  return Donation;
};
