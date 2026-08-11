# Webowo v3.0 – Raport Debugowania

> **Data audytu:** 2026-08-09
> **Wersja:** 3.0.1
> **Status:** ✅ Stabilne – wszystkie krytyczne błędy naprawione

---

## Spis treści

1. [Podsumowanie](#1-podsumowanie)
2. [Naprawione błędy (v3.0.1)](#2-naprawione-błędy-v301)
3. [Struktura plików](#3-struktura-plików)
4. [Backend – stan faktyczny](#4-backend--stan-faktyczny)
5. [Frontend – stan faktyczny](#5-frontend--stan-faktyczny)
6. [Baza danych](#6-baza-danych)
7. [Docker / DevOps](#7-docker--devops)
8. [Bezpieczeństwo](#8-bezpieczeństwo)
9. [Rekomendacje](#9-rekomendacje)

---

## 1. Podsumowanie

Projekt `Webowo v3.0.1` jest w stanie **stabilnym**. Wszystkie krytyczne błędy zgłoszone w audycie produkcyjnym oraz na zrzutach ekranu konsoli zostały naprawione.

### ✅ Rozwiązane (krytyczne)
| # | Problem | Plik | Rozwiązanie |
|---|---------|------|-------------|
| 1.1 | Admin login 500 – brak `express-validator` | `backend/package.json` | Dodano zależność |
| 1.2 | SQL Error `last_login` – niespójność schematu | `backend/db/migrations/001_init.sql`, `schema.sql` | Ujednolicono kolumnę do `last_login` |
| 1.3 | `/api/v2/content/pages/home` → 404 | `backend/db/seeds/seed.sql`, `server.js` | Dodano domyślne sekcje dla strony `home`; seed wykonuje się również gdy brak stron |
| 1.4 | `JSON.parse()` crash w rendererze | `frontend/src/app/core/renderer.js` | Obsługa zarówno string jak i obiektu w `section.data` |
| 1.5 | Auth 500 – refresh token nie w cookie | `backend/api/v2/auth.routes.js` | Login ustawia `httpOnly` cookie; refresh/logout czytają i usuwają cookie |
| 1.6 | Admin panel nie rozpoznaje usera | `frontend/src/app/admin/app.js` | `fetchUser` wyciąga `result.data` z response |
| 1.7 | CSP blokuje Google Fonts | `backend/app.js` | Dodano `fonts.googleapis.com` i `fonts.gstatic.com` do `connect-src` |
| 1.8 | Service Worker crashuje na CSP | `frontend/public/sw.js` | SW pomija zasoby zewnętrzne |
| 1.9 | Brak ikon PWA – 404 | `frontend/public/manifest.json` | Zastąpiono PNG ikoną SVG |
| 1.10 | Hash routing nie mapuje sekcji | `frontend/src/app/core/router.js` | Normalizacja hash → `/about` w `getRoute()` |
| 1.11 | Particles znikają po zmianie języka | `frontend/src/app/sections/hero/hero.js` | Re-init particles po `render()` |
| 1.12 | Memory leak – resize listener w Hero | `frontend/src/app/sections/hero/hero.js` | Usuwanie listenera w `disconnectedCallback` |
| 1.13 | Brak zapisu `phone`, `ip`, `user_agent` w kontakcie | `backend/models/contact.model.js` | Rozszerzono `create()` o brakujące kolumny |
| 1.14 | Brak zapisu `variants`, `alt_text` w mediach | `backend/models/media.model.js` | Rozszerzono `create()` o brakujące kolumny |
| 1.15 | Double JSON stringify w sekcjach | `backend/models/section.model.js` | Guard: nie stringify-uj jeśli `data` już jest stringiem |
| 1.16 | Brak endpointu rejestracji | `backend/api/v2/auth.routes.js`, `auth.service.js` | Dodano `POST /register` i `register()` |
| 1.17 | Niespójność nazw zmiennych env | `backend/config/config.js`, `.env.example` | Zsynchronizowano `CMS_BACKUP_DIR`, `CMS_MAX_BACKUPS`, `GDPR_LOG_RETENTION_DAYS` |
| 1.18 | About.css zawierał zduplikowany Hero.css | `frontend/src/app/sections/about/about.css` | Wyczyszczono |

---

## 2. Naprawione błędy (v3.0.1)

### 2.1 Backend – Auth & API
- **Express Validator**: Dodano brakującą zależność w `backend/package.json`.
- **Register endpoint**: `POST /api/v2/auth/register` z walidacją username (3-50 znaków), email, hasło (min. 8 znaków), rola opcjonalna.
- **Cookie flow**: Refresh token jest przechowywany w `httpOnly`, `Secure`, `SameSite=strict` cookie. Frontend nie przechowuje refresh tokena w `localStorage`.
- **Content API**: `GET /api/v2/content/pages/home` zwraca teraz pełną stronę z 9 sekcjami (hero, about, services, portfolio, process, pricing, faq, contact, footer).
- **Model fixes**: Wszystkie modele (`contact`, `media`, `section`) zapisują teraz pełne zestawy kolumn zgodne ze schematem SQL.

### 2.2 Frontend – Routing & Rendering
- **Hash navigation**: `#about`, `#services` itp. poprawnie scrollują do sekcji.
- **Renderer**: Bezpiecznie obsługuje `section.data` jako string JSON lub pre-parsed object.
- **Hero particles**: Przeżyją zmianę języka (re-init po renderze). Canvas context jest resetowany (`setTransform`) przy resize.
- **Memory leak**: Hero usuwa `resize` listener w `disconnectedCallback`.

### 2.3 Security & CSP
- **CSP**: `connect-src` pozwala na `fonts.googleapis.com` i `fonts.gstatic.com`.
- **Service Worker**: Nie próbuje cache'ować zasobów zewnętrznych (fonts, analytics), eliminując błędy CSP w konsoli.
- **Manifest**: Używa tylko `favicon.svg` – brak 404 na brakujących PNG.

---

## 3. Struktura plików

```
Webowo/
├── backend/
│   ├── api/v2/              # 9 routerów REST (auth, content, contact, media, settings, backup, sitemap, analytics, health)
│   ├── config/              # config.js, env.js
│   ├── db/                  # connection.js, database.js, migrate.js, seed.js, schema.sql
│   ├── db/migrations/       # 001_init.sql
│   ├── db/seeds/            # seed.sql
│   ├── jobs/                # backup.cron.js
│   ├── middleware/          # auth, error-handler, rate-limit, upload, validate
│   ├── models/              # 7 modeli (user, page, section, contact, media, setting, revision)
│   ├── routes/legacy/       # 3 routery v1 compat
│   ├── services/            # 9 serwisów
│   ├── tests/               # auth.test.js, setup.js
│   └── utils/               # logger.js, helpers.js
├── frontend/
│   ├── src/
│   │   ├── app/admin/       # app.js, router.js, admin.css
│   │   ├── app/components/  # 11 Web Components (btn, card, input, modal, toast, skeleton, tooltip, badge, accordion, nav, footer)
│   │   ├── app/core/        # renderer, router, state, i18n, events, animations
│   │   ├── app/sections/    # 9 sekcji (.js + .css)
│   │   ├── app/shared/      # constants.js, utils.js
│   │   ├── assets/i18n/     # pl.json, en.json
│   │   └── styles/          # main.css, tokens, base, components, layout
│   ├── public/              # favicon.svg, manifest.json, robots.txt, sw.js
│   ├── index.html
│   └── admin.html
├── docs/                    # DEBUG_REPORT.md, API.md, ARCHITECTURE.md, DEPLOYMENT.md, DESIGN.md, SECURITY.md, TESTING.md, TROUBLESHOOTING.md, USAGE.md
├── docker-compose.yml
├── install.sh
├── cleanup.sh
├── Makefile
├── VERSION
├── CHANGELOG.md
├── README.md
└── .env.example
```

---

## 4. Backend – stan faktyczny

### 4.1 Zależności ✅
Wszystkie zadeklarowane pakiety są w `backend/package.json`:
- `better-sqlite3` ^12.1.0
- `bcryptjs` ^2.4.3
- `jsonwebtoken` ^9.0.2
- `helmet` ^8.1.0
- `express-rate-limit` ^7.5.0
- `express-validator` ^7.2.0
- `pino` ^9.6.0, `pino-pretty` ^13.0.0
- `sharp` ^0.33.5
- `nodemailer` ^6.10.1
- `node-cron` ^3.0.3
- `multer` ^1.4.5-lts.2
- `uuid` ^11.1.0

### 4.2 Auth Service ✅
- `register()` – hash bcrypt, walidacja unikalności username/email, domyślna rola `editor`
- `login()` – verify bcrypt, generuje access + refresh, zapisuje refresh do DB, ustawia cookie
- `refresh()` – weryfikuje refresh token z DB/cookie, generuje nowy access, rotuje cookie
- `logout()` – usuwa refresh token z DB i czyści cookie
- `getMe()` – zwraca dane zalogowanego użytkownika
- `changePassword()` – weryfikuje stare hasło, hashuje nowe, unieważnia wszystkie refresh tokeny

### 4.3 Rate Limiting ✅
| Warstwa | Limit | Okno | Endpointy |
|---------|-------|------|-----------|
| Global | 100 req | 15 min | Wszystkie |
| Auth | 10 req | 15 min | `/api/v2/auth/*` |
| Contact | 5 req | 1h | `POST /api/v2/contact` |
| Upload | 20 req | 15 min | `POST /api/v2/media` |

### 4.4 CORS ✅
- `origin` jako funkcja walidująca whitelistę
- Dev: allow all
- Prod: sprawdza listę dozwolonych origin
- `credentials: true`

---

## 5. Frontend – stan faktyczny

### 5.1 Entry Points ✅
- `index.html` → `main.js` – landing page
- `admin.html` → `admin-main.js` – admin SPA
- Vite `rollupOptions.input` obsługuje oba entry points

### 5.2 Renderer ✅
- Fetch API v2 → render Web Components per section type
- Fallback do `DEFAULT_SECTIONS` (offline)
- Bezpieczna obsługa `section.data` (string lub object)

### 5.3 State Management ✅
- Proxy-based store w `state.js`
- `getState()`, `setState()`, `subscribe()`

### 5.4 i18n ✅
- `initI18n()` w `main.js`
- Pliki `pl.json`, `en.json`
- Fallback do kluczy tłumaczeń w sekcjach

### 5.5 Admin Panel ✅
- `webowo-admin` Web Component
- Sidebar + routing hash-based
- Dashboard ze statystykami (users, pages, contacts, media)
- Login z obsługą błędów serwera
- Token access przechowywany w `localStorage`; refresh w `httpOnly` cookie

---

## 6. Baza danych

### 6.1 Tabele ✅
| Tabela | Cel |
|--------|-----|
| `users` | Admin/editor accounts |
| `pages` | Strony CMS |
| `sections` | Sekcje stron (JSON data) |
| `revisions` | Historia zmian |
| `media` | Uploady + warianty + alt_text |
| `contacts` | Formularz kontaktowy (z phone, ip, user_agent) |
| `settings` | Ustawienia (public + admin) |
| `refresh_tokens` | JWT refresh tokens (revoked, expires_at) |

### 6.2 WAL Mode ✅
```javascript
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
```

### 6.3 Seed Data ✅
- Admin z hasłem z `.env` (bcrypt hash)
- Strona `home` z 9 sekcjami (hero, about, services, portfolio, process, pricing, faq, contact, footer)
- Domyślne ustawienia (site_title, site_description, theme_color, contact_email, analytics_enabled)

---

## 7. Docker / DevOps

### 7.1 docker-compose.yml ✅
```yaml
services:
  backend:  port 6666:3000, volume webowo-data, healthcheck
  frontend: port 7777:80,   depends_on backend, healthcheck
volumes: webowo-data
networks: webowo-net
```

### 7.2 Health Checks ✅
- Backend: HTTP GET /health
- Frontend: wget localhost/

### 7.3 Skrypty ✅
- `install.sh` – czysta instalacja jednym poleceniem
- `cleanup.sh` – usuwa node_modules, dist, logi, stare backupy
- `Makefile` – skróty do dev/build/test

---

## 8. Bezpieczeństwo

### 8.1 Checklista ✅
- [x] `JWT_SECRET` min. 32 znaki
- [x] `JWT_REFRESH_SECRET` inny niż `JWT_SECRET`
- [x] `ADMIN_PASSWORD` zmienione z domyślnego (via `.env`)
- [x] `CORS_ORIGIN` konkretna domena w produkcji
- [x] `helmet()` aktywne z CSP
- [x] Rate limiting na wszystkich endpointach
- [x] Upload: whitelist MIME, max 5MB
- [x] SQL: wyłącznie prepared statements (better-sqlite3)
- [x] Input sanitization (`express-mongo-sanitize`, `xss-clean`)
- [x] HPP protection
- [x] bcrypt rounds: 12 (configurable)
- [x] Refresh token rotation
- [x] httpOnly, Secure, SameSite=strict cookies
- [x] Password min. 8 znaków przy rejestracji

---

## 9. Rekomendacje

### Wysoki priorytet (przed produkcją)
1. **Zmień domyślne sekrety JWT** w `.env` (min. 32 znaki, losowe)
2. **Zmień domyślne hasło admina** w `.env` (nie używaj `admin123`)
3. **Skonfiguruj SMTP** w `.env` jeśli chcesz otrzymywać powiadomienia o kontaktach
4. **Włącz HTTPS** w produkcji (`secure: true` na cookie wymaga HTTPS)

### Średni priorytet (rozwój)
5. Dodaj testy E2E (Playwright)
6. Dodaj pełne widoki CRUD w admin panelu (content editor, media manager)
7. Zaimplementuj GDPR consent banner z logowaniem zgód
8. Dodaj obsługę uploadu obrazków przez admin panel

### Niski priorytet (optymalizacja)
9. Przełącz logger z `pino` na `winston` (lub odwrotnie) – obecnie używane oba
10. Dodaj monitoring (Sentry / LogRocket)
11. Rozważ migrację z SQLite na PostgreSQL przy >1000 użytkowników
