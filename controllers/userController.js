const userService = require('../services/userService');

// Get all users
async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getAllUsers();
    // Map users to exclude sensitive data
    const sanitizedUsers = users.map(user => ({
      _id: user._id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt
    }));
    res.json(sanitizedUsers);
  } catch (error) {
    next(error);
  }
}

// Get user by ID
async function getById(req, res, next) {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return user data without password
    const { _id, name, email, createdAt, updatedAt } = user;
    res.json({ _id, name, email, createdAt, updatedAt });
  } catch (error) {
    next(error);
  }
}

// Create new user
async function createUser(req, res, next) {
  try {
    const user = await userService.createUser(req.body);
    // Return user data without password
    const { _id, name, email, createdAt, updatedAt } = user;
    res.status(201).json({ _id, name, email, createdAt, updatedAt });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    next(error);
  }
}

// Update user
async function updateUser(req, res, next) {
  try {
    const user = await userService.updateUser(req.params.id, req.body);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Return updated user data without password
    const { _id, name, email, createdAt, updatedAt } = user;
    res.json({ _id, name, email, createdAt, updatedAt });
  } catch (error) {
    if (error.name === 'ValidationError') {
      error.statusCode = 400;
    }
    next(error);
  }
}

// Delete user
async function deleteUser(req, res, next) {
  try {
    const result = await userService.deleteUser(req.params.id);
    if (!result) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ deleted: true });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getAllUsers,
  getById,
  createUser,
  update: updateUser,
  delete: deleteUser
};