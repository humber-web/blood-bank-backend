'use strict';
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Fetch role and permission IDs
    const roles = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Roles";`
    );

    const rolesRows = roles[0];

    const permissions = await queryInterface.sequelize.query(
      `SELECT id, name FROM "Permissions";`
    );

    const permissionsRows = permissions[0];

    // Define role-permission associations
    const rolePermissions = [];

    rolesRows.forEach((role) => {
      if (role.name === 'Admin') {
        // Admin has all permissions
        permissionsRows.forEach((permission) => {
          rolePermissions.push({
            role_id: role.id,
            permission_id: permission.id,
            created_at: new Date(),
            updated_at: new Date(),
          });
        });
      } else if (role.name === 'User') {
        // User has limited permissions
        const userPermissions = ['READ_USER'];
        userPermissions.forEach((permName) => {
          const perm = permissionsRows.find(p => p.name === permName);
          if (perm) {
            rolePermissions.push({
              role_id: role.id,
              permission_id: perm.id,
              created_at: new Date(),
              updated_at: new Date(),
            });
          }
        });
      }
      // Add more roles and their permissions as needed
    });

    await queryInterface.bulkInsert('RolePermissions', rolePermissions, {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('RolePermissions', null, {});
  },
};
