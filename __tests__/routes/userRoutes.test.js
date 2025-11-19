const mongoose = require('mongoose');
const request = require('supertest');
const app = require('../../app');
const User = require('../../models/userModel');

describe('User Routes', () => {
  let server;
  let testUser;
  let userService;

  beforeAll(async () => {
    server = app.listen(0);
    await User.deleteMany({});
    userService = require('../../services/userService');
  });

  afterAll(async () => {
    await User.deleteMany({});
    await server.close();
  });

  beforeEach(async () => {
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
    });
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('GET /api/users', () => {
    it('should get all users', async () => {
      await User.create({
        name: 'Another User',
        email: 'another@example.com',
        password: 'password123',
      });

      const response = await request(server).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);

      const foundUser = response.body.find((u) => u._id === testUser._id.toString());
      expect(foundUser).toBeDefined();
      expect(foundUser).toMatchObject({
        name: testUser.name,
        email: testUser.email,
      });
      expect(foundUser).not.toHaveProperty('password');
    });

    it('should return empty array when no users exist', async () => {
      await User.deleteMany({});
      const response = await request(server).get('/api/users');
      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(0);
    });

    it('should handle unexpected errors', async () => {
      const originalGetAll = userService.getAllUsers;
      userService.getAllUsers = jest.fn().mockRejectedValue(new Error('Unexpected error'));

      const response = await request(server).get('/api/users');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Unexpected error');

      userService.getAllUsers = originalGetAll;
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user', async () => {
      const newUser = {
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
      };

      const response = await request(server)
        .post('/api/users')
        .send(newUser);

      expect(response.status).toBe(201);
      expect(response.body).toMatchObject({
        name: newUser.name,
        email: newUser.email,
      });
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 400 for invalid user data', async () => {
      const response = await request(server)
        .post('/api/users')
        .send({
          name: '',
          email: 'invalid-email',
          password: '123',
        });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/validation failed/i);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should get a single user', async () => {
      const response = await request(server).get(`/api/users/${testUser._id.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        _id: testUser._id.toString(),
        name: testUser.name,
        email: testUser.email,
      });
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 500 for invalid user ID format', async () => {
      const response = await request(server).get('/api/users/invalid-id');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 if user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(server).get(`/api/users/${nonExistentId}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('PUT /api/users/:id', () => {
    it('should update an existing user', async () => {
      const updateData = {
        name: 'Updated Name',
        email: 'updated@example.com',
      };

      const response = await request(server)
        .put(`/api/users/${testUser._id.toString()}`)
        .send(updateData);

      expect(response.status).toBe(200);
      expect(response.body).toMatchObject({
        _id: testUser._id.toString(),
        ...updateData,
      });
    });

    it('should return 500 for invalid user ID format', async () => {
      const response = await request(server)
        .put('/api/users/invalid-id')
        .send({ name: 'Updated' });

      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });

    it('should handle validation errors during update', async () => {
      const response = await request(server)
        .put(`/api/users/${testUser._id.toString()}`)
        .send({ email: 'invalid-email' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toMatch(/valid email address/i);
    });

    it('should return 404 if user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(server)
        .put(`/api/users/${nonExistentId}`)
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('DELETE /api/users/:id', () => {
    it('should delete a user', async () => {
      const userToDelete = await User.create({
        name: 'To Delete',
        email: 'delete@example.com',
        password: 'password123',
      });

      const response = await request(server).delete(`/api/users/${userToDelete._id.toString()}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ deleted: true });

      const deletedUser = await User.findById(userToDelete._id);
      expect(deletedUser).toBeNull();
    });

    it('should return 500 for invalid user ID format', async () => {
      const response = await request(server).delete('/api/users/invalid-id');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message');
    });

    it('should return 404 if user not found', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const response = await request(server).delete(`/api/users/${nonExistentId}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'User not found');
    });
  });

  describe('Error Handling', () => {
    it('should handle unexpected errors in controller', async () => {
      const originalGetAllUsers = userService.getAllUsers;
      userService.getAllUsers = jest.fn().mockRejectedValue(new Error('Unexpected error'));

      const response = await request(server).get('/api/users');
      expect(response.status).toBe(500);
      expect(response.body).toHaveProperty('message', 'Unexpected error');

      userService.getAllUsers = originalGetAllUsers;
    });
  });
});
