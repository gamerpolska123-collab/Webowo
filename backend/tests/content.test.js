// ============================================
// Webowo v3.1 – Content Tests
// ============================================

const request = require('supertest');
const app = require('../app');

describe('Content API', () => {
  test('GET /api/v2/content/pages/home returns page', async () => {
    const res = await request(app).get('/api/v2/content/pages/home');
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.slug).toBe('home');
  });

  test('GET /api/v2/content/pages/nonexistent returns 404', async () => {
    const res = await request(app).get('/api/v2/content/pages/nonexistent');
    expect(res.status).toBe(404);
    expect(res.body.success).toBe(false);
  });
});
