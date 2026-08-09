# Webowo v3.0

> Profesjonalne strony internetowe, sklepy online i aplikacje webowe.

[![Version](https://img.shields.io/badge/version-3.0.0-blue)](VERSION)
[![Node](https://img.shields.io/badge/node-%3E%3D18-green)](https://nodejs.org)
[![License](https://img.shields.io/badge/license-MIT-lightgrey)](LICENSE)

## 🚀 Funkcje

- **Frontend:** SPA z Web Components, Lenis smooth scroll, dark mode, PWA
- **Backend:** Express.js, SQLite (better-sqlite3), JWT auth, rate limiting
- **Admin Panel:** Dark theme dashboard, zarządzanie treścią, wiadomości, media
- **Bezpieczeństwo:** Helmet CSP, bcrypt, JWT z refresh tokens, CSRF, input validation
- **SEO:** Sitemap.xml, robots.txt, meta tags, Schema.org ready
- **DevOps:** Docker, Docker Compose, Nginx, Makefile, auto-backup

## 📁 Struktura

```
Webowo/
├── backend/          # API Express.js
│   ├── api/v2/       # REST API routes
│   ├── config/       # Konfiguracja
│   ├── db/           # Baza danych SQLite
│   ├── jobs/         # Cron jobs (backup)
│   ├── middleware/   # Auth, rate-limit, error-handler
│   ├── models/       # Modele danych
│   ├── services/     # Logika biznesowa
│   └── utils/        # Logger, helpers
├── frontend/         # Aplikacja SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── admin/      # Panel admina
│   │   │   ├── components/ # Web Components (UI + Layout)
│   │   │   ├── core/       # Router, State, i18n, Animations, Renderer
│   │   │   └── sections/   # Sekcje strony (Hero, About, Services, ...)
│   │   ├── styles/         # Design tokens, typography, grid, buttons
│   │   └── assets/         # i18n pliki
│   └── public/       # SW, manifest, ikony
├── docker-compose.yml
├── Makefile
└── install.sh
```

## 🛠️ Instalacja

### Wymagania
- Node.js 18+
- npm 9+
- Docker (opcjonalnie)

### Szybki start

```bash
# 1. Klonuj repozytorium
git clone https://github.com/gamerpolska123-collab/Webowo.git
cd Webowo

# 2. Zainstaluj zależności
make install
# lub
./install.sh

# 3. Skonfiguruj środowisko
cp .env.example .env
# Edytuj .env – zmień JWT_SECRET, hasła admina

# 4. Uruchom
make dev
# Backend: http://localhost:6666
# Frontend: http://localhost:7777
```

### Docker

```bash
# Produkcja
docker-compose up -d

# Logi
docker-compose logs -f

# Backup ręczny
docker-compose exec backend npm run backup
```

## 🔑 Dostęp do admina

- **URL:** `/admin.html`
- **Login:** `admin` (lub z .env)
- **Hasło:** `admin123` (lub z .env)

## 🧪 Testy

```bash
cd backend && npm test
cd frontend && npm test
```

## 📄 Licencja

MIT © 2026 Patryk Matys
