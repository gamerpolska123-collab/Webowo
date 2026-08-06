# Testowanie

> **Wersja:** 2.0.0  
> **Ostatnia aktualizacja:** 2026-08-06

---

## Strategia testowania

Projekt używa trzech poziomów testów:

1. **Unit tests** – testowanie funkcji czystych, serwisów, modeli
2. **Integration tests** – testowanie endpointów API (Supertest)
3. **E2E tests** – testowanie krytycznych ścieżek użytkownika (Playwright)

---

## Stack testowy

| Narzędzie | Rola |
|-----------|------|
| Jest | Unit + Integration tests |
| Supertest | HTTP assertions dla API |
| Playwright | E2E (browser automation) |
| Vitest | Unit tests frontend (opcjonalnie) |

---

## Unit Tests

### Backend

```bash
cd backend
npm test
```

**Przetestowane:**
- [x] `services/auth.service.js` – hash, verify, token generation
- [x] `services/content.service.js` – CRUD, publish, rollback
- [x] `services/media.service.js` – Sharp variants generation
- [x] `utils/helpers.js` – escapeHtml, slugify, formatDate

**Do przetestowania:**
- [ ] `services/email.service.js` – SMTP mock
- [ ] `services/backup.service.js` – dump creation
- [ ] `utils/validators.js` – email, phone, NIP

### Frontend

```bash
cd frontend
npm test
```

**Do przetestowania:**
- [ ] `app/core/state.js` – Proxy store
- [ ] `app/shared/helpers.js` – debounce, throttle
- [ ] `app/components/ui/btn.js` – Web Component lifecycle

---

## Integration Tests

### Auth flow

```javascript
// backend/tests/auth.integration.test.js
describe('POST /api/v2/auth/login', () => {
  it('returns 200 with valid credentials', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({ username: 'admin', password: 'admin123' });
    expect(res.status).toBe(200);
    expect(res.body.data.accessToken).toBeDefined();
  });

  it('returns 401 with invalid password', async () => {
    const res = await request(app)
      .post('/api/v2/auth/login')
      .send({ username: 'admin', password: 'wrong' });
    expect(res.status).toBe(401);
  });
});
```

### Rate limiting

```javascript
describe('POST /api/v2/contact rate limit', () => {
  it('returns 429 after 5 requests', async () => {
    for (let i = 0; i < 5; i++) {
      await request(app).post('/api/v2/contact').send(validData);
    }
    const res = await request(app).post('/api/v2/contact').send(validData);
    expect(res.status).toBe(429);
  });
});
```

### Content API

```javascript
// backend/tests/content.test.js
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
```

---

## E2E Tests (Playwright)

### Krytyczne ścieżki

```bash
cd frontend
npx playwright test
```

**Scenariusze:**
- [ ] **Landing page** – strona ładuje się, wszystkie sekcje są widoczne
- [ ] **Formularz kontaktowy** – wypełnienie, submit, komunikat sukcesu
- [ ] **Login** – przejście do /admin, logowanie, redirect do dashboard
- [ ] **CMS** – edycja treści, zapis, podgląd zmian na landing page
- [ ] **Upload** – drag & drop obrazka, podgląd w galerii

```javascript
// frontend/e2e/contact.spec.js
test('user can submit contact form', async ({ page }) => {
  await page.goto('http://localhost:7777');
  await page.fill('[name="name"]', 'Jan Kowalski');
  await page.fill('[name="email"]', 'jan@example.com');
  await page.selectOption('[name="service"]', 'website');
  await page.fill('[name="message"]', 'Test message');
  await page.check('[name="gdpr"]');
  await page.click('button[type="submit"]');
  await expect(page.locator('.toast--success')).toBeVisible();
});
```

---

## CI Test Pipeline

```yaml
# .github/workflows/test.yml
name: Test
on: [push, pull_request]
jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: cd backend && npm ci && npm test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '22' }
      - run: cd frontend && npm ci && npm test

  e2e-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: docker compose up -d
      - run: cd frontend && npx playwright install && npx playwright test
```

---

*Strategia testowania wersji 2.0.0*
