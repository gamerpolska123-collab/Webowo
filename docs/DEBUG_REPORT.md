# Webowo v2.0 – Raport Debugowania

> **Data audytu:** 2026-08-06  
> **Wersja:** 2.0.0  
> **Status:** ✅ Stabilne – Etap 5 zakończony, Etap 6-9 w toku

---

## Spis treści

1. [Podsumowanie](#1-podsumowanie)
2. [Stan krytycznych problemów](#2-stan-krytycznych-problemów)
3. [Struktura plików](#3-struktura-plików)
4. [Backend – stan faktyczny](#4-backend--stan-faktyczny)
5. [Frontend – stan faktyczny](#5-frontend--stan-faktyczny)
6. [Baza danych](#6-baza-danych)
7. [Docker / DevOps](#7-docker--devops)
8. [Bezpieczeństwo](#8-bezpieczeństwo)
9. [Rekomendacje](#9-rekomendacje)

---

## 1. Podsumowanie

Projekt `Webowo v2.0` jest w stanie **stabilnym (Etap 5 zakończony)**. Wszystkie krytyczne problemy zgłoszone w poprzednim audycie zostały rozwiązane. Pozostałe zadania dotyczą rozwoju funkcjonalności (admin panel, UX, testy E2E).

### ✅ Rozwiązane (poprzednio krytyczne)
| # | Problem | Rozwiązanie |
|---|---------|-------------|
| 1.1 | Duplikaty sekcji `*-section.js` | Usunięte – wszystkie sekcje w podkatalogach `sections/*/` |
| 1.2 | Rozproszone style CSS | Ujednolicone – co-location (`sections/*/*.css`) + import w `main.css` |
| 1.3 | Niespójne wersje | Zsynchronizowane do `2.0.0` we wszystkich plikach |
| 1.4 | Brak skryptu instalacji | Utworzono `install.sh` |
| 1.5 | CORS konflikty | Skonfigurowane poprawnie z walidacją origin |
| 2.1 | Brak Web Components registration | Wszystkie komponenty zarejestrowane w `main.js` |
| 2.2 | Frontend nie używa API v2 | `renderer.js` fetchuje `/api/v2/content/pages/home` z fallbackiem |
| 2.3 | i18n niepodłączony | Zainicjalizowany w `main.js` |
| 2.4 | JWT refresh token flow | httpOnly cookie, `/refresh`, `/logout` – działa |
| 2.5 | Brak indeksów SQL | Dodane w `001_init.sql` |
| 2.6 | Hardcoded hasło admina | Dynamiczne hashowanie z `.env` w `seed.js` |
| 2.7 | Brak testów | Podstawowe testy Jest + Supertest dodane |
| 2.8 | Backup cron bez obsługi błędów | Try/catch + Pino logging |

### 🟡 Pozostałe (niekrytyczne, rozwój)
| # | Problem | Priorytet |
|---|---------|-----------|
| 3.1 | Admin panel – brak pełnych widoków CRUD | Wysoki |
| 3.2 | i18n w sekcjach – hardcoded strings | Średni |
| 3.3 | Testy E2E (Playwright) – brak | Średni |
| 3.4 | Animacje sekcji (IntersectionObserver) | Średni |
| 3.5 | GDPR consent logging | Średni |

---

## 2. Stan krytycznych problemów

### 2.1 Struktura sekcji frontendu ✅

```
frontend/src/app/sections/
├── about/
│   ├── about.js
│   └── about.css          ← nowy plik
├── contact/
│   ├── contact.js
│   └── contact.css        ← nowy plik
├── faq/
│   ├── faq.js
│   └── faq.css            ← nowy plik
├── footer/
│   ├── footer.js
│   └── footer.css         ← nowy plik
├── hero/
│   ├── hero.js
│   └── hero.css           ← nowy plik
├── portfolio/
│   ├── portfolio.js
│   └── portfolio.css      ← nowy plik
├── pricing/
│   ├── pricing.js
│   └── pricing.css        ← nowy plik
├── process/
│   ├── process.js
│   └── process.css        ← nowy plik
└── services/
    ├── services.js
    └── services.css       ← nowy plik
```

Brak plików `*-section.js` – wyczyszczone.

### 2.2 Style CSS ✅

`frontend/src/styles/main.css` importuje:
- `tokens/colors.css`
- `base/typography.css`
- `components/buttons.css`
- `layout/grid.css`
- Wszystkie `sections/*/*.css` (co-location)

### 2.3 Wersje ✅

| Plik | Wersja |
|------|--------|
| `VERSION` | 2.0.0 |
| `backend/package.json` | 2.0.0 |
| `frontend/package.json` | 2.0.0 |
| `CHANGELOG.md` | 2.0.0 (2026-08-05) |
| `backend/config/config.js` | `appVersion` czytane z `package.json` |

### 2.4 JWT Flow ✅

- **Access token**: JSON response, 15 min
- **Refresh token**: `httpOnly`, `Secure`, `SameSite=strict`, 7 dni cookie
- **Refresh endpoint**: czyta z cookie (`req.cookies.webowo_refresh`)
- **Logout**: czyści cookie (`Max-Age=0`)
- **Frontend**: `fetch` z `credentials: 'include'`

### 2.5 Web Components ✅

Wszystkie komponenty zarejestrowane w `main.js`:
- `webowo-btn`, `webowo-card`, `webowo-input`, `webowo-modal`, `webowo-toast`, `webowo-skeleton`, `webowo-tooltip`
- `webowo-nav`, `webowo-footer`, `webowo-container`, `webowo-grid`

### 2.6 API v2 + Fallback ✅

`renderer.js`:
1. Próbuje `/api/v2/content/pages/home`
2. Fallback do `/api/content` (legacy)
3. Fallback do `DEFAULT_SECTIONS` (hardcoded)

### 2.7 Baza danych ✅

- WAL mode włączony (`connection.js`)
- Foreign keys włączone
- Indeksy: `users.email`, `pages.slug`, `contacts.created_at`, `revisions.page_id`, `media.filename`, `refresh_tokens.token`
- Seed: dynamiczne hashowanie hasła admina przez bcrypt

### 2.8 Docker ✅

- `docker-compose.yml` z `backend` + `frontend`
- Named volume `webowo-data` (SQLite, uploads, backups, logs)
- Health checks dla obu serwisów
- `install.sh` do czystej instalacji
- `cleanup.sh` do sprzątania

---

## 3. Struktura plików

```
WebDev/
├── backend/
│   ├── api/v2/           # 8 routerów REST
│   ├── config/           # config.js, env.js
│   ├── db/               # connection, database, migrate, seed, schema
│   ├── db/migrations/    # 001_init.sql
│   ├── db/seeds/         # 001_demo_data.sql
│   ├── jobs/             # backup.cron.js
│   ├── middleware/       # auth, error-handler, rate-limit, upload, validate
│   ├── models/           # 7 modeli (repository pattern)
│   ├── routes/legacy/      # 6 routerów v1.4
│   ├── services/         # 8 serwisów
│   ├── tests/            # auth.test.js, content.test.js, setup.js
│   └── utils/            # logger.js, helpers.js
├── frontend/
│   ├── src/
│   │   ├── app/admin/      # app.js, router.js
│   │   ├── app/components/ # 11 Web Components
│   │   ├── app/core/       # renderer, router, state, i18n, events, animations
│   │   ├── app/sections/   # 9 sekcji (.js + .css)
│   │   ├── app/shared/     # constants.js, utils.js
│   │   ├── assets/i18n/    # pl.json, en.json
│   │   └── styles/         # main.css, tokens, base, components, layout
│   ├── public/           # favicon, manifest, robots, sw.js
│   ├── index.html        # Landing
│   └── admin.html        # Admin SPA
├── docs/               # 10 plików dokumentacji
├── design/             # tokens.json, specyfikacje
├── docker-compose.yml
├── install.sh
├── cleanup.sh
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
- `zod` ^3.25.0
- `pino` ^9.6.0, `pino-pretty` ^13.0.0
- `sharp` ^0.33.5
- `nodemailer` ^6.10.1
- `node-cron` ^3.0.3
- `multer` ^1.4.5-lts.2
- `uuid` ^11.1.0

### 4.2 Auth Service ✅

- `register()` – hash bcrypt, walidacja unikalności
- `login()` – verify bcrypt, generuje access + refresh, zapisuje refresh do DB
- `refresh()` – weryfikuje refresh token z DB, generuje nowy access
- `logout()` – usuwa refresh token z DB i cookie

### 4.3 Media Service ✅

- `processImage()` – zapis oryginału, Sharp generuje warianty WebP (thumb/medium/large)
- `getAll()` – parsuje JSON variants
- `delete()` – usuwa pliki z dysku + rekord z DB

### 4.4 Upload Middleware ✅

- Whitelist MIME: JPEG, PNG, WebP, AVIF, SVG
- Max size: 5MB
- Filename: `Date.now() + '-' + Math.random()` + ext
- Storage: `config.uploads.dir`

### 4.5 Rate Limiting ✅

| Warstwa | Limit | Okno | Endpointy |
|---------|-------|------|-----------|
| Global | 100 req | 15 min | Wszystkie |
| Auth | 10 req | 15 min | `/api/v2/auth/*` |
| Contact | 5 req | 1h | `POST /api/v2/contact` |
| Upload | 20 req | 15 min | `POST /api/v2/media` |

### 4.6 CORS ✅

- `origin` jako funkcja walidująca
- Dev: allow all
- Prod: sprawdza listę dozwolonych origin
- `credentials: true`
- Zakaz `*` w produkcji

---

## 5. Frontend – stan faktyczny

### 5.1 Entry Points ✅

- `index.html` → `main.js` – landing page
- `admin.html` → `admin-main.js` – admin SPA
- Vite `rollupOptions.input` obsługuje oba entry points

### 5.2 Renderer ✅

- Fetch API v2 → render Web Components per section type
- Fallback do legacy API
- Fallback do `DEFAULT_SECTIONS` (offline)

### 5.3 State Management ✅

- Proxy-based store w `state.js`
- `getState()`, `setState()`, `subscribe()`

### 5.4 i18n ✅

- `initI18n()` w `main.js`
- Pliki `pl.json`, `en.json`
- **TODO:** Użyć w sekcjach zamiast hardcoded strings

### 5.5 Admin Panel 🟡

- `webowo-admin` Web Component
- Sidebar + routing hash-based
- Layout gotowy
- **TODO:** Pełne widoki CRUD (content, media, contacts, settings, users, backups)

---

## 6. Baza danych

### 6.1 Tabele ✅

| Tabela | Cel |
|--------|-----|
| `users` | Admin/editor accounts |
| `pages` | Strony CMS |
| `sections` | Sekcje stron |
| `revisions` | Historia zmian |
| `media` | Uploady + warianty |
| `contacts` | Formularz kontaktowy |
| `settings` | Ustawienia (public + admin) |
| `refresh_tokens` | JWT refresh tokens |

### 6.2 WAL Mode ✅

```javascript
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = ON');
```

### 6.3 Seed Data ✅

- Admin z hasłem z `.env` (bcrypt hash)
- Strona `home` z 9 sekcjami
- Domyślne ustawienia

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

### 7.3 Volumes ✅

- `webowo-data` – named volume (unika problemów z uprawnieniami bind mount)

### 7.4 Skrypty ✅

- `install.sh` – czysta instalacja jednym poleceniem
- `cleanup.sh` – usuwa node_modules, dist, logi, stare backupy

---

## 8. Bezpieczeństwo

### 8.1 Checklista ✅

- [x] `JWT_SECRET` min. 32 znaki (walidacja w `env.js`)
- [x] `JWT_REFRESH_SECRET` inny niż `JWT_SECRET`
- [x] `ADMIN_PASSWORD` zmienione z domyślnego (via `.env`)
- [x] `CORS_ORIGIN` konkretna domena w produkcji
- [x] `helmet()` aktywne
- [x] Rate limiting na wszystkich endpointach
- [x] Upload: whitelist MIME, max 5MB
- [x] SQL: wyłącznie prepared statements (better-sqlite3)
- [x] Logi: Pino JSON, brak haseł/tokenów
- [x] HTTPS wymuszony (Nginx redirect + HSTS w helmet)
- [x] `.env` w `.gitignore`
- [x] Kontener Docker: non-root user (w Dockerfile)

### 8.2 JWT Flow ✅

- Access: Bearer header, 15 min
- Refresh: httpOnly Secure SameSite=Strict cookie, 7 dni
- Refresh rotation: nowy refresh token przy każdym refresh
- Unieważnianie: DELETE z DB przy logout

### 8.3 Upload Security ✅

- `path.basename()` sanityzacja nazwy
- `uuid` prefix w nazwie pliku (media.service.js)
- MIME whitelist po stronie serwera
- Max size: 5MB

---

## 9. Rekomendacje

### Tura 1 – Admin Panel (najwyższy priorytet)
1. Dokończyć widoki CRUD w `frontend/src/app/admin/app.js`
2. Dodać drag & drop do zmiany kolejności sekcji
3. Dodać rich text editor do treści sekcji (opcjonalnie)

### Tura 2 – UX / Animacje
4. Dodać IntersectionObserver animations do sekcji
5. Zaimplementować lazy loading obrazków
6. Dodać counter animation dla statystyk (about)

### Tura 3 – Testy
7. Dodać E2E testy Playwright (login, CMS, contact form)
8. Rozszerzyć unit tests (media.service, email.service)

### Tura 4 – GDPR / Compliance
9. Logowanie consent przy submit formularza kontaktowego
10. Mechanizm eksportu danych osobowych (RODO)

---

*Raport sporządzony na podstawie analizy kodu źródłowego z repozytorium.*
