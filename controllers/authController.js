// controllers/authController.js
const { User } = require('../models');
const { validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// User Registration
const register = async (req, res, next) => {
  // Validate Request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { username, email, password, role } = req.body;
  
  try {
    // Check if user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'Email already in use.' });
    }
    
    // Create new user
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'User',
    });
    
    // Respond with user data (excluding password)
    const { password: pwd, ...userData } = user.toJSON();
    res.status(201).json(userData);
  } catch (error) {
    next(error);
  }
};

// User Login
const login = async (req, res, next) => {
  // Validate Request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  
  const { email, password } = req.body;
  
  try {
    // Find user by email
    const user = await User.findOne({ where: { email } });
    if (!user || !user.validPassword(password)) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }
    
    // Generate JWT
    const payload = {
      id: user.id,
      username: user.username,
      role: user.role,
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || '1h',
    });
    
    res.json({ token });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
};
