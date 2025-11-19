const User = require('../models/userModel');

async function findAll() {
  return User.find().lean().exec();
}

async function findById(id) {
  return User.findById(id).lean().exec();
}

async function create(userData) {
  const user = new User(userData);
  return user.save();
}

async function update(id, userData) {
  return User.findByIdAndUpdate(
    id, 
    userData, 
    { new: true, runValidators: true }
  ).lean().exec();
}

async function deleteUser(id) {
  const result = await User.deleteOne({ _id: id });
  return result.deletedCount > 0;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: deleteUser
};