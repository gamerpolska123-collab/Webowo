// ============================================
// Webowo v3.1 – Auth Tests
// ============================================

const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  test('POST /api/v2/auth/login with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({ username: 'admin', password: 'test12345' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('POST /api/v2/auth/login with invalid credentials', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
    expect(res.body.success).toBe(false);
  });
});
