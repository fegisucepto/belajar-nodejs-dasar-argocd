const { v4: uuidv4 } = require('uuid');
const User = require('../models/userModel');

class UserRepository {
  constructor() {
    this.users = new Map();
    // seed data
    const u1 = new User({ id: uuidv4(), name: 'Budi', email: 'budi@example.com' });
    const u2 = new User({ id: uuidv4(), name: 'Siti', email: 'siti@example.com' });
    this.users.set(u1.id, u1);
    this.users.set(u2.id, u2);
  }

  findAll() {
    return Array.from(this.users.values());
  }

  findById(id) {
    return this.users.get(id) || null;
  }

  save(userData) {
    const id = uuidv4();
    const user = new User({ id, ...userData });
    this.users.set(id, user);
    return user;
  }

  update(id, userData) {
    if (!this.users.has(id)) return null;
    const existing = this.users.get(id);
    const updated = { ...existing, ...userData, id };
    this.users.set(id, updated);
    return updated;
  }

  delete(id) {
    return this.users.delete(id);
  }
}

module.exports = new UserRepository();
