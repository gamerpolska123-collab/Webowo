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

## CI/CD – GitHub Actions (pełny workflow)

Utwórz plik `.github/workflows/deploy.yml`:

```yaml
name: Deploy

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

env:
  NODE_VERSION: '22'
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  # ─────────────────────────────────────────
  # 1. Testy + Lint + Build
  # ─────────────────────────────────────────
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Node
        uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
          cache: 'npm'
          cache-dependency-path: |
            backend/package-lock.json
            frontend/package-lock.json

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

  # ─────────────────────────────────────────
  # 2. Lighthouse CI (tylko na PR)
  # ─────────────────────────────────────────
  lighthouse:
    runs-on: ubuntu-latest
    if: github.event_name == 'pull_request'
    needs: test
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: ${{ env.NODE_VERSION }}
      - name: Build & Serve
        run: |
          cd frontend
          npm ci
          npm run build
          npx serve dist -l 7777 &
      - name: Run Lighthouse CI
        run: |
          npm install -g @lhci/cli
          lhci autorun --config=lighthouserc.json
        env:
          LHCI_GITHUB_APP_TOKEN: ${{ secrets.LHCI_GITHUB_APP_TOKEN }}

  # ─────────────────────────────────────────
  # 3. Build & Push Docker Images
  # ─────────────────────────────────────────
  docker:
    runs-on: ubuntu-latest
    needs: test
    if: github.ref == 'refs/heads/main'
    permissions:
      contents: read
      packages: write
    steps:
      - uses: actions/checkout@v4

      - name: Set up Docker Buildx
        uses: docker/setup-buildx-action@v3

      - name: Log in to GitHub Container Registry
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata
        id: meta
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}
          tags: |
            type=sha,prefix=
            type=raw,value=latest

      - name: Build & Push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta.outputs.tags }}-backend
          cache-from: type=gha
          cache-to: type=gha,mode=max

      - name: Build & Push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.meta.outputs.tags }}-frontend
          cache-from: type=gha
          cache-to: type=gha,mode=max

  # ─────────────────────────────────────────
  # 4. Backup przed deployem + Deploy VPS
  # ─────────────────────────────────────────
  deploy:
    runs-on: ubuntu-latest
    needs: [test, docker]
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v4

      - name: Setup SSH
        uses: webfactory/ssh-agent@v0.9.0
        with:
          ssh-private-key: ${{ secrets.SSH_PRIVATE_KEY }}

      - name: Backup before deploy
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} \
            "cd /opt/webowo && docker compose exec backend npm run backup"

      - name: Deploy to VPS
        run: |
          ssh -o StrictHostKeyChecking=no ${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }} \
            "cd /opt/webowo && \
             docker compose pull && \
             docker compose up -d --remove-orphans && \
             docker system prune -f"

      - name: Health check
        run: |
          sleep 10
          curl -f http://${{ secrets.SSH_HOST }}:6666/health || exit 1
```

### Wymagane secrets w GitHub

| Secret | Opis |
|--------|------|
| `SSH_PRIVATE_KEY` | Klucz prywatny do VPS |
| `SSH_USER` | Użytkownik na VPS |
| `SSH_HOST` | Adres IP / domena VPS |
| `LHCI_GITHUB_APP_TOKEN` | Token Lighthouse CI (opcjonalnie) |

### Plik `frontend/lighthouserc.json`

```json
{
  "ci": {
    "collect": {
      "url": ["http://localhost:7777/"],
      "numberOfRuns": 3
    },
    "assert": {
      "preset": "lighthouse:recommended",
      "assertions": {
        "categories:performance": ["warn", { "minScore": 0.9 }],
        "categories:accessibility": ["error", { "minScore": 0.95 }],
        "categories:best-practices": ["warn", { "minScore": 0.9 }],
        "categories:seo": ["warn", { "minScore": 0.9 }]
      }
    },
    "upload": {
      "target": "temporary-public-storage"
    }
  }
}
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
| `GDPR_LOG_RETENTION_DAYS` | ❌ | `365` (domyślnie) |

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
