# Instalacja – Webowo v2.0

> **Wersja dokumentu:** 2.0.0  
> **Ostatnia aktualizacja:** 2026-08-06

---

## Spis treści

1. [Wymagania](#wymagania)
2. [Instalacja przez Docker (zalecana)](#instalacja-przez-docker-zalecana)
3. [Instalacja lokalna (bez Docker)](#instalacja-lokalna-bez-docker)
4. [Czysta instalacja z ZIP](#czysta-instalacja-z-zip)
5. [Troubleshooting](#troubleshooting)
6. [Aktualizacja](#aktualizacja)

---

## Wymagania

### Docker (zalecane)

- Docker >= 24.0
- Docker Compose >= 2.20
- 2 GB RAM (minimum)
- 5 GB wolnego miejsca na dysku

### Lokalna (dev)

- Node.js >= 22.0.0 LTS
- npm >= 10
- Git (opcjonalnie)

---

## Instalacja przez Docker (zalecana)

### Krok 1: Przygotowanie plików

```bash
# Rozpakuj archiwum ZIP (czysta instalacja)
unzip webowo-v2.0.0.zip
cd WebDev
```

### Krok 2: Konfiguracja środowiska

```bash
cp .env.example .env
nano .env   # lub vim / code
```

**Wymagane zmienne do ustawienia:**

```env
# ─── BEZPIECZEŃSTWO ───
JWT_SECRET=TwojBardzoDlugiISkomplikowanySecretMin32Znaki
JWT_REFRESH_SECRET=InnyBardzoDlugiISkomplikowanySecretMin32Znaki
ADMIN_PASSWORD=TwojeSilneHasloAdmina

# ─── EMAIL (opcjonalne) ───
EMAIL_ENABLED=true
SMTP_HOST=smtp.twojadomena.pl
SMTP_PORT=587
SMTP_USER=kontakt@twojadomena.pl
SMTP_PASS=twoje-haslo-smtp
EMAIL_FROM=kontakt@twojadomena.pl
EMAIL_TO=biuro@twojadomena.pl

# ─── DOMENA (dla CORS i email) ───
CORS_ORIGIN=https://twojadomena.pl
```

> ⚠️ **WAŻNE:** `JWT_SECRET` i `JWT_REFRESH_SECRET` muszą mieć min. 32 znaki. Wygeneruj je:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Krok 3: Pierwsze uruchomienie

```bash
./install.sh
```

Lub ręcznie:

```bash
docker compose up --build -d
```

To polecenie:
1. Zbuduje obraz backendu (Node.js 22 Alpine).
2. Zbuduje obraz frontendu (Vite build + Nginx Alpine).
3. Uruchomi kontenery.
4. Automatycznie wykona migracje bazy.
5. Wypełni bazę danymi seed (admin + domyślna strona).

### Krok 4: Weryfikacja

```bash
# Status kontenerów
docker compose ps

# Logi backendu
docker compose logs -f backend

# Logi frontendu (Nginx)
docker compose logs -f frontend

# Test API
curl http://localhost:6666/health

# Test strony
curl http://localhost:7777
```

### Krok 5: Dostęp

| Usługa | URL | Uwagi |
|--------|-----|-------|
| Strona (landing) | http://localhost:7777 | Nginx serwuje statyczne pliki |
| Admin panel | http://localhost:7777/admin | SPA admina |
| API v2 | http://localhost:6666/api/v2 | Bezpośredni dostęp do backendu |
| Legacy API | http://localhost:6666/api | Kompatybilność wsteczna |
| Health check | http://localhost:6666/health | Status serwera |

### Krok 6: Logowanie do admina

```
URL: http://localhost:7777/admin
Login: admin
Hasło: [to co ustawiłeś w ADMIN_PASSWORD]
```

---

## Instalacja lokalna (bez Docker)

Użyj tej metody tylko do developmentu. Na produkcji zawsze używaj Docker.

### Backend

```bash
cd backend

# 1. Zależności
npm install

# 2. Konfiguracja
cp .env.example .env
# Edytuj .env

# 3. Baza danych
npm run db:migrate
npm run db:seed

# 4. Start
npm run dev
```

### Frontend

W osobnym terminalu:

```bash
cd frontend

# 1. Zależności
npm install

# 2. Konfiguracja
cp .env.example .env
# Edytuj .env – ustaw VITE_API_BASE_URL=http://localhost:3000/api/v2

# 3. Start dev server
npm run dev
```

Frontend będzie dostępny pod `http://localhost:5173`.

---

## Czysta instalacja z ZIP

### Procedura czystej instalacji

```bash
# 1. Wypakuj
cd /var/www
unzip webowo-v2.0.0.zip
mv WebDev webowo
cd webowo

# 2. Konfiguracja
cp .env.example .env
# Edytuj .env

# 3. Uruchomienie
./install.sh
# lub: docker compose up --build -d

# 4. Gotowe
```

### Skrypt install.sh

Projekt zawiera gotowy skrypt `install.sh`:

```bash
#!/bin/bash
set -e

echo "🚀 Webowo v2.0 – Czysta instalacja"
echo "===================================="

# Sprawdź wymagania
command -v docker >/dev/null 2>&1 || { echo "❌ Docker jest wymagany"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { echo "❌ Docker Compose jest wymagany"; exit 1; }

# Konfiguracja
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Utworzono .env – EDYTUJ GO TERAZ!"
  exit 0
fi

# Walidacja sekretów
if grep -q 'change-me-in-production-please' .env; then
  echo "⚠️  UWAGA: Domyślne sekrety JWT w .env! Zmień je przed uruchomieniem."
  exit 1
fi

# Build & run
echo "🔧 Budowanie i uruchamianie..."
docker compose up --build -d

# Czekaj na healthcheck
echo "⏳ Czekam na gotowość serwisów..."
sleep 10

# Status
docker compose ps

echo ""
echo "✅ Instalacja zakończona!"
echo "   Strona:    http://localhost:7777"
echo "   Admin:     http://localhost:7777/admin"
echo "   API:       http://localhost:6666/api/v2"
echo "   Health:    http://localhost:6666/health"
echo ""
echo "📋 Logi:     docker compose logs -f backend"
echo "🗄️  Backup:   docker compose exec backend npm run backup"
```

---

## Troubleshooting

### Backend nie startuje – błąd bazy danych

```bash
# Usuń starą bazę (UWAGA: stracisz dane!)
docker compose exec backend rm -f /app/data/db/webowo.sqlite

# Przebuduj i wykonaj migracje od nowa
docker compose down
docker compose up --build -d
```

### Frontend nie widzi API – CORS

Sprawdź `CORS_ORIGIN` w `.env`. W developmentcie ustaw:
```env
CORS_ORIGIN=http://localhost:5173
```

### Problemy z uprawnieniami (Linux)

Projekt używa named volume (`webowo-data`) zamiast bind mount, więc problemy z uprawnieniami są minimalne. Jeśli wystąpią:

```bash
# Sprawdź właściciela volume
docker run --rm -v webowo-data:/data alpine ls -la /data
```

### Port zajęty

Jeśli port `7777` lub `6666` jest zajęty, zmień w `.env`:
```env
FRONTEND_PORT=8080
BACKEND_PORT=3001
```

I zaktualizuj `docker-compose.yml` odpowiednio.

---

## Aktualizacja

### Aktualizacja do nowej wersji (Docker)

```bash
# Pobierz nowe pliki (git pull lub nowy ZIP)

# Zatrzymaj
docker compose down

# Przebuduj z cache-bust
docker compose build --no-cache

# Uruchom
docker compose up -d

# Sprawdź migracje (jeśli są nowe)
docker compose exec backend npm run db:migrate
```

### Aktualizacja bez utraty danych

Dane są trzymane w volume `webowo-data` (SQLite, uploads, backups, logs). Przy standardowej aktualizacji nie są usuwane.

> ⚠️ Zawsze rób backup przed aktualizacją:
> ```bash
> docker compose exec backend npm run backup
> ```

---

*Szczegółowa instrukcja instalacji dla Webowo v2.0.*
