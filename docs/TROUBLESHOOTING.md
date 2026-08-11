# Troubleshooting – Webowo v3.0

> **Wersja:** 3.0.1
> **Ostatnia aktualizacja:** 2026-08-09

---

## Spis treści

1. [Backend nie startuje](#backend-nie-startuje)
2. [Błąd 500 przy logowaniu](#blad-500-przy-logowaniu)
3. [404 na /api/v2/content/pages/home](#404-na-apiv2contentpageshome)
4. [CSP blokuje zasoby](#csp-blokuje-zasoby)
5. [Service Worker – błędy w konsoli](#service-worker--bledy-w-konsoli)
6. [Particles znikają po zmianie języka](#particles-znikaja-po-zmianie-jezyka)
7. [Brak ikon PWA](#brak-ikon-pwa)
8. [Docker – problemy z uprawnieniami](#docker--problemy-z-uprawnieniami)
9. [Baza danych jest zablokowana](#baza-danych-jest-zablokowana)
10. [FAQ nie otwiera się](#faq-nie-otwiera-sie)

---

## Backend nie startuje

**Objaw:** `Error: Cannot find module 'express'`

**Rozwiązanie:**
```bash
cd backend
npm install
```

**Objaw:** `Error: Cannot find module 'express-validator'`

**Rozwiązanie:**
```bash
cd backend
npm install express-validator
```

---

## Błąd 500 przy logowaniu

**Objaw:** Konsola przeglądarki pokazuje `POST /api/v2/auth/login 500`

**Przyczyny:**
1. Brak `express-validator` w zależnościach (naprawione w v3.0.1)
2. Błąd w schemacie SQL – niespójna nazwa kolumny `last_login`

**Rozwiązanie:**
```bash
cd backend
npm install
node db/index.js reset
```

---

## 404 na /api/v2/content/pages/home

**Objaw:** Frontend pokazuje pustą stronę, w konsoli `404 /api/v2/content/pages/home`

**Przyczyna:** Baza danych nie ma zseedowanych sekcji dla strony `home`.

**Rozwiązanie:**
```bash
cd backend
node db/index.js reset
```

Lub ręcznie:
```bash
node db/index.js migrate
node db/index.js seed
```

---

## CSP blokuje zasoby

**Objaw:** W konsoli: `Refused to load the font... because it violates Content Security Policy`

**Przyczyna:** Helmet CSP nie zezwala na `fonts.googleapis.com`.

**Rozwiązanie:** W `backend/app.js` dodaj do `connectSrc`:
```javascript
connectSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
```

(Naprawione w v3.0.1)

---

## Service Worker – błędy w konsoli

**Objaw:** `TypeError: Failed to fetch` w `sw.js` przy ładowaniu fontów

**Przyczyna:** SW próbował cache'ować zasoby zewnętrzne (Google Fonts).

**Rozwiązanie:** SW pomija teraz zasoby spoza origin. (Naprawione w v3.0.1)

---

## Particles znikają po zmianie języka

**Objaw:** Cząsteczki w Hero znikają po kliknięciu przełącznika języka

**Przyczyna:** `render()` niszczy canvas, ale `_initParticles()` nie jest ponownie wywoływane.

**Rozwiązanie:** (Naprawione w v3.0.1) – particles są re-inicjalizowane po każdym `render()`.

---

## Brak ikon PWA

**Objaw:** `Failed to load resource: icon-192.png 404`

**Przyczyna:** Manifest wskazywał na nieistniejące pliki PNG.

**Rozwiązanie:** (Naprawione w v3.0.1) – manifest używa teraz `favicon.svg`.

---

## Docker – problemy z uprawnieniami

**Objaw:** `EACCES: permission denied, open '/app/data/db/webowo.sqlite'`

**Rozwiązanie:**
```bash
# Upewnij się, że volume jest poprawnie zamontowane
docker compose down -v
docker compose up --build
```

Lub uruchom bez Docker:
```bash
cd backend && npm start
cd frontend && npm run dev
```

---

## Baza danych jest zablokowana

**Objaw:** `SQLITE_BUSY: database is locked`

**Rozwiązanie:**
1. Upewnij się, że nie masz dwóch instancji backendu działających jednocześnie
2. Sprawdź czy WAL mode jest włączony:
   ```bash
   sqlite3 data/db/webowo.sqlite "PRAGMA journal_mode;"
   ```
   Powinno zwrócić `wal`.

---

## FAQ nie otwiera się

**Objaw:** Kliknięcie pytania w FAQ nie rozwija odpowiedzi

**Przyczyna:** Niezgodność klas CSS między JS a CSS (naprawione w v3.0.1).

**Rozwiązanie:** Upewnij się, że masz wersję >= 3.0.1.
