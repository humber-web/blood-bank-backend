// models/role.js
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Role extends Model {
    static associate(models) {
      Role.hasMany(models.User, { foreignKey: 'role_id', as: 'users' });
      // Define other associations here (e.g., Role.hasMany(models.Permission))
    }
  }

  Role.init(
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
          isIn: [['User', 'Admin', 'Doctor']], // Allowed roles
        },
      },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'Roles',
      timestamps: true,
      underscored: true,
    }
  );

  return Role;
};
