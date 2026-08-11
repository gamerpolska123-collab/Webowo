# Usage Guide – Webowo v3.0

> **Wersja:** 3.0.1
> **Ostatnia aktualizacja:** 2026-08-09

---

## Spis treści

1. [Pierwsze uruchomienie](#pierwsze-uruchomienie)
2. [Logowanie do admin panelu](#logowanie-do-admin-panelu)
3. [Zarządzanie treścią](#zarzadzanie-trescia)
4. [Formularz kontaktowy](#formularz-kontaktowy)
5. [Upload mediów](#upload-mediow)
6. [Kopie zapasowe](#kopie-zapasowe)
7. [Zmiana języka](#zmiana-jezyka)
8. [API Reference](#api-reference)

---

## Pierwsze uruchomienie

### Lokalnie (bez Docker)

```bash
# 1. Klonuj repozytorium
git clone https://github.com/gamerpolska123-collab/Webowo.git
cd Webowo

# 2. Skopiuj i edytuj konfigurację
cp .env.example .env
# Edytuj .env — ustaw JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD

# 3. Backend
cd backend
npm install
node db/index.js migrate
node db/index.js seed
npm start

# 4. Frontend (nowe okno terminala)
cd ../frontend
npm install
npm run dev
```

Frontend: `http://localhost:7777`  
Backend: `http://localhost:6666`  
Admin: `http://localhost:7777/admin.html`

### Docker Compose (rekomendowane)

```bash
cp .env.example .env
# Edytuj .env
./install.sh
# lub: docker compose up --build -d
```

---

## Logowanie do admin panelu

1. Otwórz `http://localhost:7777/admin.html`
2. Wpisz dane logowania:
   - **Username:** `admin` (lub z `.env` `ADMIN_USERNAME`)
   - **Password:** `admin123` (lub z `.env` `ADMIN_PASSWORD`)
3. Kliknij "Zaloguj się"

**Uwaga:** Domyślne hasło `admin123` jest niebezpieczne. Zmień je w `.env` przed wdrożeniem produkcyjnym.

---

## Zarządzanie treścią

Treść strony głównej jest przechowywana w bazie danych jako sekcje JSON.

### Edycja przez API

```bash
# Pobierz stronę home
curl http://localhost:6666/api/v2/content/pages/home

# Zaktualizuj sekcję
curl -X PUT http://localhost:6666/api/v2/content/pages/home/sections/1   -H "Authorization: Bearer <token>"   -H "Content-Type: application/json"   -d '{"data": {"title": "Nowy tytuł"}}'
```

### Struktura sekcji

| ID | Typ | Opis |
|----|-----|------|
| 1 | `hero` | Sekcja powitalna z particles |
| 2 | `about` | O mnie + statystyki |
| 3 | `services` | Usługi (4 karty) |
| 4 | `portfolio` | Portfolio z filtrowaniem |
| 5 | `process` | Proces współpracy (4 kroki) |
| 6 | `pricing` | Cennik (3 plany) |
| 7 | `faq` | FAQ z wyszukiwaniem |
| 8 | `contact` | Formularz kontaktowy |
| 9 | `footer` | Stopka |

---

## Formularz kontaktowy

Formularz na stronie głównej wysyła dane do `POST /api/v2/contact`.

**Pola:**
- `name` (wymagane) – Imię i nazwisko
- `email` (wymagane) – Adres e-mail
- `subject` (wymagane) – Temat
- `budget` (opcjonalne) – Budżet
- `message` (wymagane) – Treść wiadomości

**Powiadomienia e-mail:**  
Włącz w `.env`:
```
EMAIL_ENABLED=true
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## Upload mediów

```bash
curl -X POST http://localhost:6666/api/v2/media   -H "Authorization: Bearer <token>"   -F "file=@image.jpg"
```

**Ograniczenia:**
- Max 5MB
- Dozwolone: JPEG, PNG, WebP, AVIF, SVG, GIF
- Automatycznie generowane warianty: thumbnail (300x300), medium (800x600), large (1600x1200)

---

## Kopie zapasowe

### Ręczna kopia

```bash
curl -X POST http://localhost:6666/api/v2/backup   -H "Authorization: Bearer <token>"
```

### Automatyczna kopia (cron)

Domyślnie codziennie o 03:00. Konfiguracja w `.env`:
```
BACKUP_ENABLED=true
BACKUP_CRON=0 3 * * *
BACKUP_RETENTION_DAYS=30
CMS_MAX_BACKUPS=20
```

### Przywracanie

```bash
curl -X POST http://localhost:6666/api/v2/backup/restore   -H "Authorization: Bearer <token>"   -H "Content-Type: application/json"   -d '{"filename": "backup-2026-08-09T03-00-00.sqlite"}'
```

---

## Zmiana języka

Frontend automatycznie wykrywa język przeglądarki. Ręczna zmiana:

```javascript
// W konsoli przeglądarki
localStorage.setItem('locale', 'en');
location.reload();
```

Dostępne języki: `pl` (domyślny), `en`.

Pliki tłumaczeń: `frontend/src/assets/i18n/pl.json`, `en.json`

---

## API Reference

Pełna dokumentacja endpointów: [docs/API.md](API.md)

### Kluczowe endpointy

| Endpoint | Metoda | Opis | Auth |
|----------|--------|------|------|
| `/api/v2/auth/register` | POST | Rejestracja | – |
| `/api/v2/auth/login` | POST | Logowanie | – |
| `/api/v2/auth/refresh` | POST | Odśwież token | Cookie |
| `/api/v2/auth/logout` | POST | Wylogowanie | ✅ |
| `/api/v2/auth/me` | GET | Profil użytkownika | ✅ |
| `/api/v2/content/pages/:slug` | GET | Pobierz stronę | – |
| `/api/v2/contact` | POST | Wyślij wiadomość | – |
| `/api/v2/contact` | GET | Lista wiadomości | ✅ |
| `/api/v2/media` | POST | Upload pliku | ✅ |
| `/api/v2/settings/public` | GET | Publiczne ustawienia | – |
| `/api/v2/backup` | POST | Utwórz kopię | ✅ |
| `/health` | GET | Health check | – |
