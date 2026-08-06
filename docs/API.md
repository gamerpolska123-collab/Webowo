# Dokumentacja API

> **Wersja:** 2.0.0  
> **Base URL:** `http://localhost:6666`

---

## Spis treści

- [API v2](#api-v2)
  - [Auth](#auth)
  - [Content](#content)
  - [Media](#media)
  - [Contact](#contact)
  - [Settings](#settings)
  - [Backups](#backups)
- [Legacy API (v1.4)](#legacy-api-v14)
- [Kody błędów](#kody-bledow)
- [Rate Limiting](#rate-limiting)

---

## API v2

### Auth

#### POST /api/v2/auth/register
Rejestracja nowego użytkownika.

**Request:**
```json
{
  "username": "admin",
  "email": "admin@example.com",
  "password": "Min8Znakow!"
}
```

**Response 201:**
```json
{
  "success": true,
  "message": "Konto utworzone. Zaloguj się.",
  "data": { "id": 1, "username": "admin", "email": "admin@example.com" }
}
```

#### POST /api/v2/auth/login
Logowanie. Zwraca accessToken (JSON) + refreshToken (httpOnly cookie).

**Request:**
```json
{
  "username": "admin",
  "password": "TwojeHaslo"
}
```

**Response 200:**
```json
{
  "success": true,
  "data": {
    "user": { "id": 1, "username": "admin", "role": "admin" },
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "15m"
  }
}
```
**Cookie:** `webowo_refresh=...; HttpOnly; Secure; SameSite=Strict; Max-Age=604800`

#### POST /api/v2/auth/refresh
Odświeżenie access tokena na podstawie refresh tokena z cookie.

**Cookie wymagany:** `webowo_refresh`

**Response 200:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "expiresIn": "15m"
  }
}
```

#### POST /api/v2/auth/logout
Wylogowanie. Czyści refresh cookie i usuwa token z DB.

**Cookie wymagany:** `webowo_refresh`

**Response 200:**
```json
{
  "success": true,
  "message": "Wylogowano pomyślnie."
}
```

#### GET /api/v2/auth/me
Dane zalogowanego użytkownika.

**Header:** `Authorization: Bearer <accessToken>`

**Response 200:**
```json
{
  "success": true,
  "data": { "id": 1, "username": "admin", "role": "admin", "email": "admin@example.com" }
}
```

---

### Content

#### GET /api/v2/content/pages
Lista stron (publikowanych).

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 1, "slug": "home", "title": "Strona główna", "status": "published", "updatedAt": "2026-08-06T..." }
  ]
}
```

#### GET /api/v2/content/pages/:slug
Pojedyncza strona z sekcjami.

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "slug": "home",
    "title": "Strona główna",
    "sections": [ ... ],
    "meta": { "lastModified": "2026-08-06T..." }
  }
}
```

#### POST /api/v2/content/pages
Utwórz stronę.

**Auth:** Bearer (admin/editor)

**Request:**
```json
{
  "slug": "o-nas",
  "title": "O nas",
  "sections": []
}
```

#### PATCH /api/v2/content/pages/:id
Edytuj stronę.

**Auth:** Bearer (admin/editor)

**Request:**
```json
{
  "title": "Nowy tytuł",
  "sections": [ ... ]
}
```

#### POST /api/v2/content/pages/:id/publish
Opublikuj stronę (z draftu).

**Auth:** Bearer (admin)

#### DELETE /api/v2/content/pages/:id
Usuń stronę.

**Auth:** Bearer (admin)

#### GET /api/v2/content/pages/:id/revisions
Historia zmian (revisions).

**Auth:** Bearer

**Response 200:**
```json
{
  "success": true,
  "data": [
    { "id": 5, "pageId": 1, "createdAt": "2026-08-06T...", "author": "admin" }
  ]
}
```

#### POST /api/v2/content/pages/:id/rollback
Przywróć wersję z revision.

**Auth:** Bearer (admin)

**Request:**
```json
{ "revisionId": 5 }
```

---

### Media

#### POST /api/v2/media
Upload obrazka (multipart/form-data).

**Auth:** Bearer

**Form data:**
- `image` – plik (max 5MB)
- `alt` (opcjonalne) – opis alternatywny

**Response 200:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "originalName": "zdjecie.jpg",
    "filename": "a1b2c3d4.jpg",
    "url": "/uploads/a1b2c3d4.jpg",
    "variants": {
      "thumb": "/uploads/a1b2c3d4-thumb.webp",
      "medium": "/uploads/a1b2c3d4-medium.webp",
      "large": "/uploads/a1b2c3d4-large.webp"
    },
    "size": 2048000,
    "mimeType": "image/jpeg"
  }
}
```

#### GET /api/v2/media
Lista mediów.

**Auth:** Bearer

#### DELETE /api/v2/media/:id
Usuń plik + warianty.

**Auth:** Bearer

---

### Contact

#### POST /api/v2/contact
Wyślij wiadomość (publiczne, rate limit 5/h).

**Request:**
```json
{
  "name": "Jan Kowalski",
  "email": "jan@example.com",
  "phone": "+48 123 456 789",
  "service": "website",
  "message": "Chcę zlecić stronę...",
  "gdpr": true
}
```

**Response 200:**
```json
{
  "success": true,
  "message": "Dziękujemy! Twoje zapytanie zostało wysłane. Odpowiemy w ciągu 24h.",
  "meta": { "emailSent": true, "webhookSent": false }
}
```

#### GET /api/v2/contact
Lista wiadomości.

**Auth:** Bearer (admin)

#### PATCH /api/v2/contact/:id/status
Zmień status wiadomości.

**Auth:** Bearer (admin)

**Request:**
```json
{ "status": "resolved" }
```

#### DELETE /api/v2/contact/:id
Usuń wiadomość.

**Auth:** Bearer (admin)

---

### Settings

#### GET /api/v2/settings/public
Publiczne ustawienia (bez auth).

**Response 200:**
```json
{
  "success": true,
  "data": {
    "siteTitle": "Webowo",
    "siteDescription": "Profesjonalne strony internetowe",
    "contactEmail": "kontakt@example.com"
  }
}
```

#### GET /api/v2/settings
Wszystkie ustawienia.

**Auth:** Bearer (admin)

#### PUT /api/v2/settings/:key
Aktualizuj ustawienie.

**Auth:** Bearer (admin)

**Request:**
```json
{ "value": "Nowa wartość" }
```

---

### Backups

#### POST /api/v2/backups
Utwórz backup bazy.

**Auth:** Bearer (admin)

**Response 200:**
```json
{
  "success": true,
  "message": "Backup utworzony.",
  "data": { "filename": "webowo-2026-08-06-03-00-00.sqlite", "size": 1048576 }
}
```

#### GET /api/v2/backups
Lista backupów.

**Auth:** Bearer (admin)

#### POST /api/v2/backups/restore
Przywróć z backupu.

**Auth:** Bearer (admin)

**Request:**
```json
{ "filename": "webowo-2026-08-06-03-00-00.sqlite" }
```

---

## Legacy API (v1.4)

Stare endpointy działają bez zmian pod `/api/*` dla kompatybilności wstecznej:

| Metoda | Endpoint | Opis |
|--------|----------|------|
| POST | `/api/content/auth/login` | Login v1 (JWT 24h) |
| GET | `/api/content` | Pobierz content.json |
| POST | `/api/content` | Zapisz content.json |
| POST | `/api/content/publish` | Publikacja draftu |
| GET | `/api/content/backups` | Lista backupów JSON |
| POST | `/api/content/rollback` | Przywróć backup JSON |
| POST | `/api/content/reorder` | Zmiana kolejności |
| POST | `/api/upload` | Upload obrazka |
| GET | `/api/upload` | Lista uploadów |
| DELETE | `/api/upload/:filename` | Usuń upload |
| POST | `/api/contact` | Formularz kontaktowy |

---

## Kody błędów

| Kod | Znaczenie | Typowe przyczyny |
|-----|-----------|------------------|
| 400 | Bad Request | Brakujące pola, nieprawidłowy JSON |
| 401 | Unauthorized | Brak tokena, nieprawidłowy token |
| 403 | Forbidden | Token wygasł, brak uprawnień |
| 404 | Not Found | Nie znaleziono zasobu |
| 422 | Unprocessable Entity | Błędy walidacji Zod |
| 429 | Too Many Requests | Rate limit przekroczony |
| 500 | Internal Server Error | Błąd serwera (sprawdź logi) |

**Format błędu:**
```json
{
  "success": false,
  "error": "Opis błędu",
  "errors": ["Szczegół 1", "Szczegół 2"],
  "code": "VALIDATION_ERROR"
}
```

---

## Rate Limiting

| Endpoint | Limit | Okno |
|----------|-------|------|
| Global | 100 req | 15 min |
| Auth (login/register) | 10 req | 15 min |
| Contact (POST) | 5 req | 1h |
| Upload (POST) | 20 req | 15 min |

**Header w odpowiedzi:**
```
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1691234567
```

---

*Dokumentacja API wersji 2.0.0*
