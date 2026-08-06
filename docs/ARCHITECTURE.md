# Architektura systemu

> **Wersja:** 2.0.0  
> **Cel:** Opis flow danych, decyzji architektonicznych i wzorców projektowych.

---

## Spis treści

1. [Filozofia architektoniczna](#filozofia-architektoniczna)
2. [Warstwy systemu](#warstwy-systemu)
3. [Flow danych](#flow-danych)
4. [Decyzje architektoniczne (ADRs)](#decyzje-architektoniczne-adrs)
5. [Wzorce projektowe](#wzorce-projektowe)
6. [Bezpieczeństwo warstwowe](#bezpieczeństwo-warstwowe)
7. [Performance Budget](#performance-budget)

---

## Filozofia architektoniczna

### 1. Monolit modularny (nie mikroserwisy)

Projekt jest monolitem z wyraźnymi modułami wewnętrznymi. Dlaczego?
- **SQLite** jest najszybszy dla CMS z pojedynczym writerem.
- **Node.js single-thread** – lepiej mieć jeden proces niż overhead komunikacji międzyserwisowej.
- **Prostota deploymentu** – jeden kontener backendu, jeden frontend.

### 2. Frontend: Zero frameworków UI

Brak React, Vue, Angular. Dlaczego?
- **Kontrola** – każdy bajt JS jest nasz.
- **Wydajność** – brak VDOM overhead, bezpośredni dostęp do DOM.
- **Web Components** – natywna enkapsulacja, reusable, future-proof.
- **Bundle size** – landing page < 80 KB JS (gzip).

### 3. Backend: Zero ORM

Brak Prisma, Sequelize, TypeORM. Dlaczego?
- **better-sqlite3** jest synchroniczny – ORM asynchroniczne dodaje overhead.
- **SQL jako źródło prawdy** – migracje SQL są czytelne i wersjonowane.
- **Repository Pattern** – modele to cienka warstwa nad prepared statements.

---

## Warstwy systemu

```
┌─────────────────────────────────────────────────────────────┐
│  LAYER 5: CLIENT (Browser)                                  │
│  ├── Landing Page (Vanilla JS, Web Components, CSS Layers)  │
│  ├── Admin SPA (Vanilla JS, Router, State)                  │
│  └── Service Worker (PWA, Cache API)                        │
├─────────────────────────────────────────────────────────────┤
│  LAYER 4: REVERSE PROXY (Nginx)                             │
│  ├── Static files (cache 1y, brotli)                        │
│  ├── Gzip/Brotli compression                                │
│  ├── Rate limiting (global)                                 │
│  ├── Security headers (HSTS, CSP, X-Frame-Options)          │
│  └── Proxy /api/* → backend:3000                            │
├─────────────────────────────────────────────────────────────┤
│  LAYER 3: API (Express.js)                                  │
│  ├── Routes (v2 + Legacy)                                   │
│  ├── Middleware (Auth, Validation, Rate Limit, Upload)      │
│  ├── Services (Business Logic)                            │
│  └── Error Handler (Global)                                 │
├─────────────────────────────────────────────────────────────┤
│  LAYER 2: DATA ACCESS (Models / Repository)               │
│  ├── User Model                                             │
│  ├── Page / Section / Revision Model                        │
│  ├── Media Model                                            │
│  ├── Contact Model                                          │
│  └── Setting Model                                          │
├─────────────────────────────────────────────────────────────┤
│  LAYER 1: DATABASE (SQLite + WAL)                           │
│  ├── webowo.sqlite                                          │
│  ├── WAL mode (concurrent reads)                            │
│  └── Migrations (SQL, wersjonowane)                         │
├─────────────────────────────────────────────────────────────┤
│  LAYER 0: INFRASTRUCTURE (Docker + Volumes)                 │
│  ├── webowo-data (SQLite, uploads, backups, logs)           │
│  ├── Health checks                                          │
│  └── Cron jobs (backup 3 AM)                                │
└─────────────────────────────────────────────────────────────┘
```

---

## Flow danych

### 1. Żądanie landing page (GET /)

```
User → Nginx (port 7777)
  → Nginx serwuje statyczne pliki z /usr/share/nginx/html
    → index.html
    → main.js (bundle Vite)
    → main.css
    → assets (images, fonts)
  → JS fetchuje /api/v2/settings/public (opcjonalnie)
  → JS fetchuje /api/v2/content/pages/home (opcjonalnie)
  → Renderer buduje DOM z danych API lub fallback JSON
```

### 2. Żądanie admin panel (GET /admin)

```
User → Nginx
  → admin.html
  → admin.js (osobny bundle)
  → Admin app.js sprawdza localStorage JWT
    → Brak tokena? Redirect do /admin#login
    → Token jest? Fetch /api/v2/auth/me
      → 200 → Render dashboard
      → 401 → Try refresh token (POST /api/v2/auth/refresh)
        → Success → Retry /me
        → Fail → Redirect do login
```

### 3. Zapis treści przez admina (PATCH /api/v2/content/pages/:id)

```
Admin JS → fetch PATCH /api/v2/content/pages/1
  → Nginx proxy → backend:3000
    → rate-limit middleware
    → auth middleware (Bearer JWT)
    → validate middleware (Zod schema)
    → content.service.js
      → page.model.js (UPDATE SQL)
      → revision.model.js (INSERT backup)
      → logger.info('Content updated')
    → JSON response { success: true }
```

### 4. Formularz kontaktowy (POST /api/v2/contact)

```
User form → fetch POST /api/v2/contact
  → rate-limit (5/h per IP)
  → validate (Zod)
  → contact.service.js
    → contact.model.js (INSERT INTO contacts)
    → email.service.js (send via nodemailer) [async, non-blocking]
    → logger.logConsent (GDPR)
  → JSON response { success: true, message: 'Dziękujemy!' }
```

### 5. Upload obrazka (POST /api/v2/media)

```
Admin → fetch POST /api/v2/media (multipart/form-data)
  → auth middleware
  → upload middleware (Multer + Sharp)
    → Zapis oryginału do /app/uploads/
    → Sharp generuje warianty:
      • thumb-300x300.webp
      • medium-800x600.webp
      • large-1600x900.webp
    → Zapis metadanych do media.model.js
  → JSON response { success: true, file: { ...variants } }
```

---

## Decyzje architektoniczne (ADRs)

### ADR-001: SQLite zamiast PostgreSQL/MySQL

**Kontekst:** CMS dla jednego użytkownika (admin), średni ruch, zero-downtime deployment nie jest krytyczny.

**Decyzja:** SQLite z WAL mode.

**Konsekwencje:**
- (+) Brak osobnego kontenera DB.
- (+) Backup to kopia pliku.
- (+) Synchroniczne zapisy – prostszy kod.
- (-) Brak horizontal scaling (niepotrzebny dla tego use case).
- (-) Brak natywnego replication.

### ADR-002: Vanilla JS zamiast React/Vue

**Kontekst:** Landing page + admin panel. Priorytet: wydajność, kontrola, bundle size.

**Decyzja:** Vanilla JS ES2024 + Web Components + Vite.

**Konsekwencje:**
- (+) Bundle < 80 KB.
- (+) Zero dependency hell.
- (+) Pełna kontrola nad DOM i lifecycle.
- (-) Więcej boilerplate przy stanowym UI (rozwiązane przez `state.js` i Web Components).
- (-) Brak ecosystemu gotowych komponentów (rozwiązane przez własny design system).

### ADR-003: No ORM – Repository Pattern

**Kontekst:** SQLite, prosty model danych, potrzeba pełnej kontroli nad SQL.

**Decyzja:** better-sqlite3 + ręczne prepared statements w modelach.

**Konsekwencje:**
- (+) Maksymalna wydajność.
- (+) SQL jako źródło prawdy – łatwe review.
- (-) Więcej kodu w modelach (akceptowalne).

### ADR-004: JWT Access + Refresh w httpOnly cookie

**Kontekst:** Bezpieczna autentykacja admina bez XSS risk.

**Decyzja:**
- Access token: short-lived (15 min), Bearer header.
- Refresh token: long-lived (7 dni), httpOnly, Secure, SameSite=strict cookie.

**Konsekwencje:**
- (+) Refresh token niedostępny dla JS (XSS-safe).
- (+) Możliwość unieważnienia refresh tokenów po stronie serwera.
- (-) Wymaga obsługi cookie w fetch (credentials: 'include').

### ADR-005: Multi-page Vite (nie SPA dla landing)

**Kontekst:** Landing page to one-page, ale admin to SPA.

**Decyzja:** Vite multi-page: `index.html` (landing) + `admin.html` (admin SPA).

**Konsekwencje:**
- (+) Landing page ma osobny, minimalny bundle.
- (+) Admin ma osobny, większy bundle (lazy-loaded).
- (+) Prostszy SSR/SEO w przyszłości.

### ADR-006: Co-location styli sekcji

**Kontekst:** Style sekcji były rozproszone między `styles/sections/` a `app/sections/*/`.

**Decyzja:** Każda sekcja trzyma swój CSS w swoim podkatalogu (`sections/hero/hero.css`).

**Konsekwencje:**
- (+) Usunięcie duplikatów.
- (+) Łatwe usuwanie sekcji (jeden katalog).
- (+) Spójność z zasadą co-location.
- (-) `main.css` musi importować wiele plików.

---

## Wzorce projektowe

### Backend

| Wzorzec | Gdzie | Dlaczego |
|---------|-------|----------|
| **Repository Pattern** | `models/*.js` | Abstrakcja nad DB, testowalność |
| **Service Layer** | `services/*.js` | Logika biznesowa poza routerami |
| **Dependency Injection** | `app.js`, `services/` | Manualne DI bez frameworka |
| **Middleware Pipeline** | `middleware/*.js` | Reużywalna walidacja, auth, rate limit |
| **Fail-Fast Config** | `config/env.js` | Walidacja .env przy starcie |
| **Structured Logging** | `utils/logger.js` | Pino + GDPR compliance |

### Frontend

| Wzorzec | Gdzie | Dlaczego |
|---------|-------|----------|
| **Web Components** | `components/ui/*.js` | Enkapsulacja, reusable, shadow DOM |
| **Co-location** | `sections/*/` | Kod + style + assety razem |
| **Observer Pattern** | `core/events.js` | Decoupled komunikacja między modułami |
| **State Management** | `core/state.js` | Globalny store bez zewnętrznej libki |
| **Lazy Loading** | `main.js` | Dynamic import dla sekcji |

---

## Bezpieczeństwo warstwowe

| Warstwa | Zabezpieczenie | Implementacja |
|---------|---------------|---------------|
| DNS / Network | HTTPS, HSTS | Nginx, Let's Encrypt |
| Application | CSP, X-Frame-Options, Referrer-Policy | Helmet |
| Auth | JWT (access 15m + refresh 7d cookie) | `jsonwebtoken` + `cookie-parser` |
| Input | Schema validation, sanitization | Zod + manual escape |
| Upload | MIME whitelist, size limit, Sharp | Multer + Sharp |
| DB | Parameterized queries | better-sqlite3 prepared statements |
| Rate Limit | Tiered limits | express-rate-limit |
| Logging | GDPR consent logs, no PII in errors | Pino |

---

## Performance Budget

| Metryka | Docelowa | Jak mierzymy |
|---------|----------|---------------|
| LCP | < 1.2 s | Lighthouse, Web Vitals |
| INP | < 100 ms | Lighthouse, Web Vitals |
| CLS | < 0.1 | Lighthouse |
| TTFB | < 200 ms | Lighthouse |
| Bundle JS (landing) | < 80 KB (gzip) | `vite-bundle-visualizer` |
| Bundle CSS | < 20 KB (gzip) | `vite-bundle-visualizer` |
| Images | WebP/AVIF, < 200 KB | Sharp variants |
| Total page weight | < 1 MB | Lighthouse |
| Lighthouse Performance | 100 | CI |
| Lighthouse Accessibility | 100 | CI |

---

*Architektura opisuje stan docelowy po zakończeniu wszystkich etapów (1-9).*
