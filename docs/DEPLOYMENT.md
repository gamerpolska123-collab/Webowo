# Deployment Guide – Webowo v2.0

> **Wersja:** 2.0.0  
> **Ostatnia aktualizacja:** 2026-08-06

---

## Wymagania

- Node.js >= 22
- Docker + Docker Compose (opcjonalnie)
- Git

---

## Szybki start (lokalnie)

```bash
# 1. Klonuj repozytorium
git clone https://github.com/gamerpolska123-collab/WebDev.git
cd WebDev

# 2. Konfiguracja
cp .env.example .env
# Edytuj .env — ustaw JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD

# 3. Backend
cd backend
npm install
npm run db:migrate
npm run db:seed
npm start

# 4. Frontend (nowe okno)
cd ../frontend
cp .env.example .env
npm install
npm run dev
```

---

## Docker Compose (rekomendowane)

```bash
cp .env.example .env
# Edytuj .env — ustaw JWT_SECRET i JWT_REFRESH_SECRET (min 32 znaki)
./install.sh
# lub: docker compose up --build -d
```

---

## CI/CD – GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install & Test Backend
        run: |
          cd backend
          npm ci
          npm test
      - name: Install & Build Frontend
        run: |
          cd frontend
          npm ci
          npm run build
      - name: Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun
      - name: Backup before deploy
        run: |
          cd backend
          npm run backup
      - name: Deploy to VPS
        run: |
          # Add your deploy script here
          echo "Deploying..."
```

---

## Struktura kontenerów

```
webowo-backend  :3000  (API + CMS)
webowo-frontend :80    (Vite build served by nginx)
webowo-data     —      (SQLite named volume)
```

---

## Zmienne środowiskowe (production)

| Zmienna | Wymagana | Opis |
|---------|----------|------|
| `JWT_SECRET` | ✅ | Min 32 znaki, losowo wygenerowane |
| `JWT_REFRESH_SECRET` | ✅ | Min 32 znaki, inne niż JWT_SECRET |
| `ADMIN_PASSWORD` | ✅ | Min 12 znaków |
| `CORS_ORIGIN` | ✅ | URL frontendu (bez `*`) |
| `EMAIL_ENABLED` | ❌ | `true` aby włączyć SMTP |
| `BACKUP_ENABLED` | ❌ | `true` (domyślnie) |
| `BACKUP_CRON` | ❌ | `0 3 * * *` (domyślnie) |

---

## Health checks

- Backend: `GET /health`
- Frontend: `GET /` (nginx)

---

## Backup & Restore

```bash
# Ręczny backup
cd backend && npm run backup

# Przywracanie (via API)
curl -X POST http://localhost:6666/api/v2/backups/restore \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"filename":"webowo-2026-08-06-03-00-00.sqlite"}'
```

---

## Deployment na Raspberry Pi

```bash
# 1. Zainstaluj Docker na Raspberry Pi
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker pi

# 2. Sklonuj repo
git clone https://github.com/gamerpolska123-collab/WebDev.git
cd WebDev

# 3. Konfiguracja
cp .env.example .env
# Edytuj .env – dostosuj PORTy i CORS_ORIGIN

# 4. Uruchomienie
./install.sh

# 5. Autostart (systemd)
sudo systemctl enable docker
# Dodaj do crontab: @reboot cd /home/pi/WebDev && docker compose up -d
```

---

*Deployment Guide wersji 2.0.0*
