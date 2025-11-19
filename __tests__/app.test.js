const request = require('supertest');
const app = require('../app');

describe('App', () => {
  describe('GET /health', () => {
    it('should return 200 and status UP', async () => {
      const response = await request(app).get('/health');
      expect(response.status).toBe(200);
      expect(response.body).toEqual({ status: 'UP' });
    });
  });

  describe('Non-existent route', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/non-existent-route');
      expect(response.status).toBe(404);
    });
  });
});