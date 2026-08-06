# Webowo v2.0

> Enterprise Landing Page & CMS  
> **Wersja:** 2.0.0  
> **Autor:** Patryk Matys – [matys.net.pl](https://matys.net.pl)

---

## Architektura

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   Frontend      │────▶│   API v2        │────▶│   SQLite (WAL)  │
│  (Vite + WC)    │     │  (Express)      │     │   + Backups     │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │
         ▼                       ▼
    Service Worker          Legacy API
    (PWA)                   (v1.4 compat)
```

## Stack

| Warstwa | Technologie |
|---------|-------------|
| **Frontend** | Vanilla JS ES2024, Web Components, Vite, Lenis, WAAPI |
| **Backend** | Node.js 22, Express 5, better-sqlite3, JWT, Zod, Pino, Sharp |
| **DevOps** | Docker, Docker Compose, GitHub Actions |
| **Testy** | Jest, Supertest, Playwright |

## Funkcje

- ✅ Reactive Store (Proxy) + Hash Router + Event Bus
- ✅ i18n (PL/EN) z lazy-load i fallbackiem
- ✅ API v2 RESTful (Auth, Content, Media, Contact, Settings, Backups)
- ✅ JWT Access (15m) + Refresh (7d, httpOnly Secure SameSite=Strict cookie)
- ✅ Web Components (Button, Card, Input, Modal, Toast, Skeleton, Tooltip, Nav, Footer)
- ✅ Admin Panel SPA (dashboard, content, media, contacts, settings, backups)
- ✅ PWA (Service Worker, Manifest, offline fallback)
- ✅ Dynamiczne meta tagi (SEO) – pobierane z API
- ✅ Sitemap.xml + robots.txt
- ✅ Auto-backup (cron 3 AM, retencja 30 dni)
- ✅ Docker + Compose (health checks, persistent volumes)
- ✅ Legacy API v1.4 (kompatybilność wsteczna)
- ✅ Tiered rate limiting (global/auth/contact/upload)
- ✅ Upload obrazków + Sharp (WebP warianty: thumb/medium/large)
- ✅ Zod validation + Helmet + CORS + structured logging (Pino)

## Szybki start (Docker)

```bash
# 1. Czysta instalacja
git clone https://github.com/gamerpolska123-collab/WebDev.git
cd WebDev

# 2. Konfiguracja
cp .env.example .env
# EDYTUJ .env – ustaw JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD

# 3. Uruchomienie
./install.sh
# lub: docker compose up --build -d

# 4. Dostęp
# Strona:  http://localhost:7777
# Admin:   http://localhost:7777/admin
# API:     http://localhost:6666/api/v2
# Health:  http://localhost:6666/health
```

## Struktura projektu

```
WebDev/
├── backend/              # Express API v2 + Legacy
│   ├── api/v2/           # REST routers
│   ├── config/           # Config + env validation
│   ├── db/               # SQLite, migrations, seeds
│   ├── jobs/             # Cron jobs (backup)
│   ├── middleware/       # Auth, rate-limit, upload, validate, error-handler
│   ├── models/           # Repository pattern (better-sqlite3)
│   ├── routes/legacy/    # v1.4 compatibility
│   ├── services/         # Business logic
│   ├── tests/            # Jest + Supertest
│   └── utils/            # Logger, helpers
├── frontend/           # Vite multi-page
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # Admin SPA
│   │   │   ├── components/ # Web Components (ui + layout)
│   │   │   ├── core/       # Renderer, Router, State, i18n, Events, Animations
│   │   │   ├── sections/   # Landing page sections (co-location: .js + .css)
│   │   │   └── shared/     # Utils, validators, constants
│   │   ├── assets/i18n/    # pl.json, en.json
│   │   └── styles/         # Global CSS (tokens, base, components, layout)
│   ├── public/           # Static assets (PWA, favicon, robots)
│   ├── index.html        # Landing page entry
│   └── admin.html        # Admin panel entry
├── docs/               # Dokumentacja techniczna
├── design/             # Design tokens, specyfikacje
├── docker-compose.yml
├── install.sh          # Czysta instalacja jednym poleceniem
├── cleanup.sh          # Cleanup node_modules, dist, volumes
└── .env.example        # Wzorzec konfiguracji
```

## Dokumentacja

| Plik | Opis |
|------|------|
| [INSTALL.md](docs/INSTALL.md) | Szczegółowa instrukcja instalacji |
| [API.md](docs/API.md) | Dokumentacja API v2 + Legacy |
| [ARCHITECTURE.md](docs/ARCHITECTURE.md) | Architektura, ADRs, flow danych |
| [SECURITY.md](docs/SECURITY.md) | Polityka bezpieczeństwa, checklista |
| [DEPLOYMENT.md](docs/DEPLOYMENT.md) | Deployment, CI/CD, backup/restore |
| [TESTING.md](docs/TESTING.md) | Strategia testowania |
| [CONTRIBUTING.md](docs/CONTRIBUTING.md) | Konwencje kodu, Git workflow |
| [STRUCTURE.md](docs/STRUCTURE.md) | Struktura katalogów, zasady organizacji |
| [MIGRATION.md](docs/MIGRATION.md) | Migracja z v1.4 do v2.0 |
| [TODO.md](TODO.md) | Aktualna lista zadań |

## Wersja

`2.0.0` – Etap 5: Backend Modernizacja (stabilne)

## Licencja

MIT © 2026 Patryk Matys
