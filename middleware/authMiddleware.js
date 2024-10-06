const jwt = require('jsonwebtoken');
const { User, Role } = require('../models'); // Adjust the path to your models

// Middleware to Authenticate Token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'No token provided.' });
  }

  // Verify token
  jwt.verify(token, process.env.JWT_SECRET, async (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid token.' });
    }

    // Fetch the role name using the role ID
    try {
      const userWithRole = await User.findByPk(user.id, {
        include: {
          model: Role,
          as: 'role', // Specify the alias used in the association
          attributes: ['name'],
        },
      });

      if (!userWithRole) {
        return res.status(404).json({ error: 'User not found.' });
      }

      req.user = {
        ...user,
        role: userWithRole.role.name, // Attach role name to request
      };

      next();
    } catch (error) {
      console.error('Error fetching user role:', error);
      return res.status(500).json({ error: 'Internal server error.' });
    }
  });
};

// Middleware to Authorize Roles
const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    console.log('User Role:', req.user.role); // Log the user's role
    console.log('Allowed Roles:', roles); // Log the allowed roles

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  authorizeRoles,
};