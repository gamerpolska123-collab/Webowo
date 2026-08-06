# Struktura katalogów – Deep Dive

> **Wersja:** 2.0.0  
> **Cel:** Wyjaśnienie logiki organizacji plików i odpowiedzialności każdego katalogu.

---

## Zasady organizacji

1. **Co-location** – pliki powiązane tematycznie są razem (np. `hero.js` + `hero.css` w `sections/hero/`).
2. **Zero duplikatów** – każda funkcjonalność istnieje w jednym miejscu.
3. **Modułowość** – można usunąć sekcję/komponent usuwając jeden katalog.
4. **Separation of Concerns** – frontend, backend, design i docs są odseparowane.

---

## Root level

| Plik / Katalog | Odpowiedzialność |
|----------------|------------------|
| `.env.example` | Wzorzec wszystkich zmiennych środowiskowych (backend + frontend) |
| `docker-compose.yml` | Orchestracja: backend + frontend + network + volumes |
| `nginx.conf` | Globalna konfiguracja Nginx (reverse proxy, SSL, gzip) |
| `Makefile` | Skróty: `make up`, `make down`, `make logs`, `make backup` |
| `VERSION` | Aktualna wersja SemVer (używana przez CI/CD i healthcheck) |
| `CHANGELOG.md` | Historia zmian per wersja |
| `eslint.config.js` | Globalna konfiguracja ESLint (monorepo) |
| `prettier.config.js` | Globalna konfiguracja Prettier |

---

## Backend (`backend/`)

### `config/`
- **`config.js`** – Centralna konfiguracja aplikacji (czyta `.env`, ustawia defaults).
- **`env.js`** – Walidacja zmiennych środowiskowych przy starcie (fail-fast).

### `db/`
- **`connection.js`** – Singleton połączenia `better-sqlite3`.
- **`database.js`** – Wrapper z metodami `query()`, `run()`, `get()`.
- **`migrate.js`** – Runner migracji: czyta pliki `.sql` z `migrations/` i wykonuje je transakcyjnie.
- **`migrations/`** – Pliki SQL wersjonowane (`001_init.sql`, `002_add_index.sql`, …).
- **`seeds/`** – Dane początkowe (admin, domyślna strona, ustawienia).

### `models/`
Warstwa Repository – bezpośredni dostęp do bazy. Każdy model eksportuje CRUD + dedykowane metody.

### `services/`
Logika biznesowa. Tutaj dzieje się „myślenie" – walidacja, agregacja, komunikacja z zewnętrznymi API (email, webhook).

### `api/v2/`
Nowe REST API. Każdy plik to router Express dla jednej domeny:
- `auth.routes.js` – login, refresh, logout, /me
- `content.routes.js` – pages CRUD, publish, revisions, rollback
- `media.routes.js` – upload, list, delete
- `contact.routes.js` – formularz kontaktowy (public), lista (admin)
- `setting.routes.js` – ustawienia (public + admin)
- `backup.routes.js` – tworzenie, lista, przywracanie backupów

### `routes/legacy/`
Stare endpointy v1.4. Frontend stary (jeśli kiedykolwiek potrzebny) działa bez zmian.

### `middleware/`
- `auth.js` – Weryfikacja JWT (access token z headera + refresh token z cookie).
- `error-handler.js` – Globalny handler: formatuje błędy Zod, Multer, JWT, 500.
- `validate.js` – Zod schema validation per route.
- `rate-limit.js` – Tiered rate limiting (global, auth, contact, upload).
- `upload.js` – Konfiguracja Multer + Sharp (whitelist MIME, max 5MB).

### `utils/`
- `logger.js` – Pino (structured JSON logs). Logi GDPR-consent są osobno.
- `helpers.js` – Funkcje czyste (formatDate, slugify, escapeHtml, itp.).

### `jobs/`
- `backup.cron.js` – Cron job uruchamiany przez `node-cron`. Tworzy dump SQLite.

### `data/`
**NIE commituj tego katalogu.** Jest to volume Docker.
- `db/` – `webowo.sqlite`
- `uploads/` – Obrazki (oryginały + warianty Sharp)
- `backups/` – Dumpy SQLite (`webowo-YYYY-MM-DD-HH-mm-ss.sqlite`)
- `logs/` – Logi Pino (`app.log`, `error.log`, `gdpr-consents.log`)

---

## Frontend (`frontend/`)

### Entry points
- **`index.html`** – Landing page (public).
- **`admin.html`** – Admin SPA (zabezpieczony, osobny bundle).
- **`main.js`** – Entry JS dla landing page.

### `src/app/core/`
Silnik aplikacji – framework-agnostic.
- `renderer.js` – Renderuje sekcje na podstawie danych z API v2.
- `router.js` – Prosty router dla admina (hash-based lub history API).
- `state.js` – Globalny store (Proxy-based lub EventTarget).
- `events.js` – Event bus dla komunikacji między modułami.
- `i18n.js` – System tłumaczeń (lazy-load JSON per lang).

### `src/app/components/`
Web Components (reusable UI). Każdy komponent to klasa dziedzicząca po `HTMLElement`.

**`ui/`** – Atomowe komponenty:
- `btn.js`, `card.js`, `input.js`, `modal.js`, `select.js`, `skeleton.js`, `textarea.js`, `toast.js`, `tooltip.js`

**`layout/`** – Komponenty layoutu:
- `nav.js`, `footer.js`, `container.js`, `grid.js`

**Pozostałe:**
- `faq-item.js` – Akordeon FAQ
- `pricing-card.js` – Karta cennika
- `process-step.js` – Krok procesu
- `newsletter-form.js` – Formularz newslettera
- `back-to-top.js` – Przycisk „wróć do góry"

### `src/app/sections/`
Sekcje landing page – **co-location**.

Każda sekcja to katalog zawierający:
- `*.js` – Logika renderowania i interakcji.
- `*.css` – Style specyficzne dla sekcji.

```
sections/
├── hero/
│   ├── hero.js          # Render hero, WebGL shader, typing effect
│   └── hero.css         # Style hero (full-height, gradient, itp.)
├── about/
│   ├── about.js         # Timeline, skills cloud, photo reveal
│   └── about.css
├── services/
│   ├── services.js      # 3D tilt cards
│   └── services.css
├── portfolio/
│   ├── portfolio.js     # Masonry grid, lightbox
│   └── portfolio.css
├── process/
│   ├── process.js       # Stepper
│   └── process.css
├── pricing/
│   ├── pricing.js       # Toggle miesiąc/rok
│   └── pricing.css
├── faq/
│   ├── faq.js           # Accordion
│   └── faq.css
├── contact/
│   ├── contact.js       # Multi-step form, mapa
│   └── contact.css
└── footer/
    ├── footer.js
    └── footer.css
```

> **Ważne:** Nie ma już plików `*-section.js` w `sections/`. Wszystko jest w podkatalogach.

### `src/app/admin/`
- `app.js` – Entry point admin SPA. Routing, auth guard, layout (sidebar + main).

### `src/app/shared/`
Utilities współdzielone przez wszystkie moduły.
- `animations.js` – WAAPI helpers, IntersectionObserver animations.
- `scroll.js` – Lenis init, scroll-to, scroll-trigger.
- `parallax.js` – Efekty parallax.
- `cursor.js` – Custom cursor (desktop only).
- `helpers.js` – Pure functions (debounce, throttle, formatNumber, itp.).
- `validators.js` – Walidatory formularzy (email, phone, NIP, itp.).

### `src/styles/`
Globalny design system.

**`tokens/`** – Design tokens jako CSS custom properties:
- `colors.css` – Paleta kolorów (primary, secondary, accent, semantic).
- `typography.css` – Fonty, skale, line-heights.
- `spacing.css` – Skala spacingu (4px base).
- `animation.css` – Durations, easings.
- `breakpoints.css` – Container query breakpoints.
- `shadows.css` – Elevation system.
- `border-radius.css` – Skala border-radius.

**`base/`** – Reset i utilities:
- `reset.css` – Modern CSS reset (nie `* { margin: 0 }`).
- `typography.css` – Base typography styles.
- `utilities.css` – Utility classes (screen-reader-only, visually-hidden, itp.).

**`layout/`** – Layout styles:
- `nav.css` – Style nawigacji (sticky, mobile menu).
- `footer.css` – Style stopki.
- `container.css` – Container queries, max-widths.

**`components/`** – Styles dla reusable UI:
- `button.css`, `card.css`, `input.css`, `modal.css`, `toast.css`

> **Brak katalogu `sections/` w `styles/`** – style sekcji są co-located w `app/sections/`.

### `src/assets/`
- `i18n/pl.json` – Tłumaczenia polskie.
- `i18n/en.json` – Tłumaczenia angielskie.

### `public/`
Statyczne pliki kopiowane do `dist/` bez zmian:
- `favicon.svg`
- `manifest.json` (PWA)
- `robots.txt`

---

## Design (`design/`)

- `tokens.json` – Źródło prawdy dla design tokens (kolory, fonty, spacing). Używany przez CI do sprawdzania spójności z CSS.
- `admin.md` – Specyfikacja UX/UI admin panelu.
- `sections.md` – Specyfikacja każdej sekcji landing page (content, layout, animations).

---

## Docs (`docs/`)

Kompletna dokumentacja techniczna i operacyjna. Patrz [README.md](../README.md#dokumentacja) dla spisu.

---

## Co NIE commitujemy

```gitignore
# Backend
backend/data/
backend/node_modules/
backend/.env
backend/logs/
backend/uploads/

# Frontend
frontend/node_modules/
frontend/dist/
frontend/.env

# Root
node_modules/
.env
*.log
```

---

*Dokument opisuje docelową, wyczyszczoną strukturę po usunięciu duplikatów i bałaganu.*
