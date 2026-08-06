// ============================================
// Auth Tests
// ============================================

const request = require('supertest');
const app = require('../app');

describe('Auth API', () => {
  test('POST /api/v2/auth/register – creates user', async () => {
    const res = await request(app)
      .post('/api/v2/auth/register')
      .send({ username: 'testuser', email: 'test@example.com', password: 'password123' });
    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.username).toBe('testuser');
  });

  test('POST /api/v2/auth/login – returns tokens', async () => {
    await request(app)
      .post('/api/v2/auth/register')
      .send({ username: 'loginuser', email: 'login@example.com', password: 'password123' });
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({ username: 'loginuser', password: 'password123' });
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.accessToken).toBeDefined();
  });

  test('POST /api/v2/auth/login – rejects wrong password', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({ username: 'loginuser', password: 'wrongpassword' });
    expect(res.status).toBe(401);
  });

  test('GET /api/v2/auth/me – requires token', async () => {
    const res = await request(app).get('/api/v2/auth/me');
    expect(res.status).toBe(401);
  });

  test('GET /health – returns ok', async () => {
    const res = await request(app).get('/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
