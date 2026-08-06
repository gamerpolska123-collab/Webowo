# Changelog

## [2.0.0] – 2026-08-05

### Etap 5: Backend Modernizacja — wydanie stabilne

- **Dodano** — SQLite database layer (better-sqlite3, WAL, migrations, models)
- **Dodano** — API v2 Auth (register, login, refresh httpOnly cookie, logout, /me)
- **Dodano** — API v2 Content (pages CRUD, sections, publish, revisions, rollback)
- **Dodano** — API v2 Media (upload, Sharp resize, WebP/AVIF variants, list, delete)
- **Dodano** — API v2 Contact & Settings (forms in DB, email, public settings)
- **Dodano** — Middleware & Security (Zod validation, Pino logging, Helmet, tiered rate-limit, CORS, global error handler)
- **Dodano** — Backup System (SQLite dump, auto-cron 3 AM, retention policy, restore)
- **Dodano** — Docker & Compose (Dockerfile, docker-compose.yml, health checks, persistent volumes)
- **Dodano** — Legacy compatibility — stare endpointy v1.4 działają bez zmian
- **Dodano** — SQL indexes w migracjach (users.email, pages.slug, contacts.created_at, revisions.page_id, media.filename)
- **Dodano** — Dynamiczne hasło admina w seed (czyta z .env, hashuje bcrypt)
- **Dodano** — Error handling w backup cron (try/catch + Pino logging)
- **Dodano** — CORS validation (zakaz `*` w produkcji)
- **Dodano** — Web Components registration w entry pointach
- **Dodano** — Frontend API v2 integration (renderer.js fetch z fallbackiem)
- **Dodano** — i18n initialization w main.js
- **Dodano** — Admin panel routing (dashboard, content, media, settings, users)
- **Dodano** — Service Worker (PWA) — cache static assets, offline fallback
- **Dodano** — Dynamiczne meta tagi (SEO) z /api/v2/settings/public
- **Dodano** — Sitemap.xml generator endpoint
- **Dodano** — install.sh i cleanup.sh
- **Dodano** — Pełny CI/CD w docs/DEPLOYMENT.md (GitHub Actions, Lighthouse CI, backup pre-deploy)
- **Poprawiono** — Usunięto duplikaty sekcji frontend (flat → modular)
- **Poprawiono** — Co-location styli CSS (styles/sections/ → app/sections/*/)
- **Poprawiono** — Synchronizacja wersji we wszystkich plikach (2.0.0)
- **Poprawiono** — JWT refresh token flow (httpOnly, Secure, SameSite=strict cookie)
- **Poprawiono** — Backend dependencies (dodano brakujące pakiety, usunięto nieużywane)

### Etap 1-4: Frontend (wcześniejsze)

- **Dodano** — Reactive Store, Hash-based SPA Router, Custom Event Bus
- **Dodano** — Section Renderer, i18n system, Animation Engine (WAAPI)
- **Dodano** — Lenis smooth scroll, Web Components (button, card, input, modal, toast, skeleton, tooltip)
- **Dodano** — Layout Components (nav, footer, container, grid)
- **Dodano** — Sekcje: hero, about, services, portfolio, process, pricing, faq, contact, footer
- **Dodano** — Admin SPA placeholder

---

## [1.4.2] – 2026-08-04
- Poprawki: memory leak contact-section, XSS escapeHtml

## [1.4.1] – 2026-08-04
- Poprawki: Web Components, Safari FAQ, CSS selektory

## [1.4.0] – 2026-08-04
- Etap 4: Process, Pricing, FAQ, Contact, Footer

## [1.3.0] – 2026-08-04
- Etap 3: Services & Portfolio

## [1.2.0] – 2026-08-04
- Etap 2: Hero & About

## [1.1.0] – 2026-08-04
- Etap 1: Fundamenty Frontend

## [1.0.0] – 2026-08-04
- Etap 0: Planowanie & Architektura
