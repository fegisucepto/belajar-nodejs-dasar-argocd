const userRepository = require('../repositories/userRepository');

async function getAllUsers() {
  return userRepository.findAll();
}

async function getUserById(id) {
  return userRepository.findById(id);
}

async function createUser(userData) {
  return userRepository.create(userData);
}

async function updateUser(id, userData) {
  return userRepository.update(id, userData);
}

async function deleteUser(id) {
  return userRepository.delete(id);
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
