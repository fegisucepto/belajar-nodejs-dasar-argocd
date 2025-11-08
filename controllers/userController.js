const userService = require('../services/userService');

async function getAll(req, res, next) {
  try {
    const users = userService.getAllUsers();
    res.json(users);
  } catch (e) { next(e); }
}

async function getById(req, res, next) {
  try {
    const user = userService.getUserById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (e) { next(e); }
}

async function create(req, res, next) {
  try {
    const created = userService.createUser(req.body);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

async function update(req, res, next) {
  try {
    const updated = userService.updateUser(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'User not found' });
    res.json(updated);
  } catch (e) { next(e); }
}

async function remove(req, res, next) {
  try {
    const ok = userService.deleteUser(req.params.id);
    if (!ok) return res.status(404).json({ message: 'User not found' });
    res.json({ deleted: true });
  } catch (e) { next(e); }
}

module.exports = { getAll, getById, create, update, remove };
