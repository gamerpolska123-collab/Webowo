# Migracja ze starej wersji (`main/`) do `Webdev2/`

> **Wersja:** 2.0.0

---

## Różnice architektoniczne

| Aspekt | Stare (`main/`) | Nowe (`Webdev2/`) |
|--------|-----------------|-------------------|
| **Baza danych** | Brak – JSON files (`content.json`, `content.draft.json`) | SQLite + WAL mode |
| **API** | Express 4, proste endpointy | Express 5, API v2 RESTful, Zod validation |
| **Auth** | JWT 24h, brak refresh | JWT 15m + refresh 7d (httpOnly cookie) |
| **Upload** | Multer basic, brak przetwarzania | Multer + Sharp (WebP/AVIF variants) |
| **Frontend** | Monolityczne JS/CSS, brak modularności | Vite, Web Components, co-location |
| **Admin** | Inline editing w landing page | Osobny SPA admin (`admin.html`) |
| **Docker** | Podstawowy Compose | Full Docker Compose + health checks |
| **Logi** | `console.log` | Pino (structured JSON) |
| **Rate limit** | Globalny jeden limit | Tiered (global/auth/contact/upload) |

---

## Procedura migracji danych

### Krok 1: Backup starej wersji

```bash
cd /stara/sciezka/Webowo
cp -r backend/data ./backup-data-$(date +%Y%m%d)
git add . && git commit -m "Pre-v2.0 backup"
```

### Krok 2: Przygotowanie nowej wersji

```bash
cd /nowa/sciezka
unzip webowo-v2.0.0.zip
cd webowo-v2.0.0
cp .env.example .env
# Wypełnij .env – szczególnie ADMIN_PASSWORD, JWT_SECRET, JWT_REFRESH_SECRET
```

### Krok 3: Uruchomienie nowego backendu

```bash
docker compose up --build -d
# Poczekaj na migracje i seed
docker compose logs -f backend
```

### Krok 4: Migracja danych (skrypt)

```bash
# Skrypt do napisania: scripts/migrate-v1-to-v2.js
node scripts/migrate-v1-to-v2.js --source /stara/sciezka/Webowo/backend/data/content.json
```

**Co skrypt powinien zrobić:**
1. Odczytać stare `content.json`
2. Utworzyć stronę `home` w nowej bazie SQLite
3. Przekonwertować sekcje na rekordy w tabeli `sections`
4. Przenieść uploady do nowego katalogu `uploads/` (zachowując nazwy)
5. Zalogować wykonane operacje

### Krok 5: Weryfikacja

```bash
# Sprawdź czy strona główna działa
curl http://localhost:7777

# Sprawdź czy API v2 zwraca dane
curl http://localhost:3000/api/v2/content/pages/home

# Zaloguj się do admina i zweryfikuj treść
```

### Krok 6: Przełączenie DNS / proxy

Gdy nowa wersja działa poprawnie:
1. Zatrzymaj starą instancję
2. Zaktualizuj Nginx / reverse proxy do nowych portów
3. Usuń stary katalog `main/` (po tygodniu obserwacji)

---

## Rollback plan

Jeśli coś pójdzie nie tak:

```bash
# Zatrzymaj nową wersję
cd /nowa/sciezka/webowo-v2.0.0
docker compose down

# Przywróć starą wersję
cd /stara/sciezka/Webowo
docker compose up -d

# Przywróć dane ze backupu
cp -r backup-data-20260805/* backend/data/
```

---

*Procedura migracji wersji 2.0.0*
