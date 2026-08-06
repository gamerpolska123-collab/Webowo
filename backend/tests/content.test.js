// ============================================
// Content Tests
// ============================================

const request = require('supertest');
const app = require('../app');

describe('Content API', () => {
  test('GET /api/v2/content/pages – returns pages', async () => {
    const res = await request(app).get('/api/v2/content/pages');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/v2/content/pages/home – returns home page', async () => {
    const res = await request(app).get('/api/v2/content/pages/home');
    expect(res.status).toBe(200);
    expect(res.body.data.slug).toBe('home');
  });

  test('GET /sitemap.xml – returns XML', async () => {
    const res = await request(app).get('/sitemap.xml');
    expect(res.status).toBe(200);
    expect(res.headers['content-type']).toContain('xml');
  });

  test('GET /robots.txt – returns text', async () => {
    const res = await request(app).get('/robots.txt');
    expect(res.status).toBe(200);
    expect(res.text).toContain('User-agent');
  });
});
