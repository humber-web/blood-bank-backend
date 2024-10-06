// models/permission.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Permission extends Model {
    static associate(models) {
      // Define associations if needed (e.g., Permission.belongsToMany(models.Role))
    }
  }

  Permission.init(
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Automatically generate UUID
        primaryKey: true,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          len: [3, 50],
        },
      },
    },
    {
      sequelize,
      modelName: 'Permission',
      tableName: 'Permissions',
      timestamps: true,
      underscored: true,
    }
  );

  return Permission;
};
