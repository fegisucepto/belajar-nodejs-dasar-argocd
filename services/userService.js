const userRepo = require('../repositories/userRepository');

class UserService {
  getAllUsers() {
    return userRepo.findAll();
  }

  getUserById(id) {
    return userRepo.findById(id);
  }

  createUser(payload) {
    if (!payload.name || !payload.email) {
      const err = new Error('name and email required');
      err.status = 400;
      throw err;
    }
    return userRepo.save(payload);
  }

  updateUser(id, payload) {
    return userRepo.update(id, payload);
  }

  deleteUser(id) {
    return userRepo.delete(id);
  }
}

module.exports = new UserService();
