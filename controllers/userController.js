const { User, Role } = require('../models');
const bcrypt = require('bcrypt');

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      include: [{ model: Role, as :'role', attributes: ['name'] }],
      attributes: { exclude: ['password'] }
    });
    res.json(users);
  } catch (error) {
    console.error('Get All Users Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

const createUser = async (req, res) => {
  const { username, email, password, role_id } = req.body;

  try {
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: 'User with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id
    });

    // Fetch the user again to include the Role association
    const newUser = await User.findByPk(user.id, {
      include: {
        model: Role,
        as: 'role', // Specify the alias used in the association
        attributes: ['name'],
      },
      attributes: { exclude: ['password'] }
    });

    res.status(201).json(newUser);
  } catch (error) {
    console.error('Create User Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// controllers/userController.js
const getUserById = async (req, res) => {
  const { id } = req.params;

  try {
    // Ensure the ID is correctly formatted
    if (!id || !id.match(/^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/)) {
      return res.status(400).json({ message: 'Invalid user ID format.' });
    }

    const user = await User.findByPk(id, {
      include: [{ model: Role, as: 'role', attributes: ['name'] }],
      attributes: { exclude: ['password'] }
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Get User By ID Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};



const updateUser = async (req, res) => {
  const { id } = req.params;
  const { username, email, password, role_id } = req.body;

  try {
    const user = await User.findByPk(id, {
      include: {
        model: Role,
        as: 'role', // Specify the alias used in the association
        attributes: ['name'],
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    user.username = username || user.username;
    user.email = email || user.email;
    user.role_id = role_id || user.role_id;

    await user.save();

    res.json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role ? user.role.name : null, // Ensure role is populated
    });
  } catch (error) {
    console.error('Update User Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};


const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.findByPk(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    await user.destroy();
    res.status(204).send();
  } catch (error) {
    console.error('Delete User Error:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getAllUsers,
  createUser,
  getUserById,
  updateUser,
  deleteUser
};
