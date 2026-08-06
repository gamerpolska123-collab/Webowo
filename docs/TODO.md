# TODO – Co jest do naprawy

> **Wersja:** 2.0.0  
> **Ostatnia aktualizacja:** 2026-08-05  
> **Status:** Przed wdrożeniem wymagane 🔴 Krytyczne

---

## Legenda

| Priorytet | Znaczenie | Kiedy |
|-----------|-----------|-------|
| 🔴 | Krytyczne – blokuje uruchomienie | Natychmiast |
| 🟡 | Wysokie – pogarsza UX / utrudnia rozwój | Tydzień 1-2 |
| 🟢 | Średnie – do poprawy przy okazji | Tydzień 3-4 |
| 🔵 | Niskie – nice to have | Przyszłość |

---

## 🔴 Krytyczne (blokujące uruchomienie)

### 1. Usunąć duplikaty sekcji frontendu
**Lokalizacja:** `frontend/src/app/sections/`
**Problem:** Istnieją zarówno `contact-section.js` (stary wzorzec flat) jak i `contact/contact.js` (nowy wzorzec modularny). To samo dotyczy `faq`, `footer`, `pricing`, `process`.
**Rozwiązanie:**
- Usunąć wszystkie pliki `*-section.js` z `frontend/src/app/sections/`
- Upewnić się, że `renderer.js` importuje tylko z podkatalogów
- Jeśli jakaś sekcja nie ma podkatalogu – utworzyć go

### 2. Ujednolicić lokalizację styli CSS
**Lokalizacja:** `frontend/src/styles/sections/` vs `frontend/src/app/sections/*/*.css`
**Problem:** Style sekcji są rozproszone. `styles/sections/` ma tylko część plików, brakuje `hero.css`, `about.css`, `services.css`, `portfolio.css`.
**Rozwiązanie:**
- Zdecydować się na **co-location** (Opcja B)
- Przenieść `styles/sections/*.css` do odpowiednich podkatalogów `app/sections/`
- Usunąć katalog `styles/sections/`
- Zaktualizować `styles/main.css`

### 3. Zsynchronizować wersje we wszystkich plikach
**Lokalizacja:** Root, backend, frontend
**Problem:** `README.md` mówi 2.0.0, ale `package.json` (backend i frontend), `VERSION`, `CHANGELOG.md` mogą mieć inne wersje.
**Rozwiązanie:**
- Ustawić `"version": "2.0.0"` w obu `package.json`
- Ustawić `2.0.0` w pliku `VERSION`
- Zaktualizować `CHANGELOG.md` – pierwszy wpis: `## [2.0.0] - 2026-08-05`
- Dodać pole `appVersion` w `backend/config/config.js` czytane z `package.json`

### 4. Uzupełnić pliki `.env.example`
**Lokalizacja:** Root, `backend/`, `frontend/`
**Problem:** Brak kompletnego `.env.example` z wszystkimi zmiennymi.
**Rozwiązanie:**
- Utworzyć root `.env.example` (wszystkie zmienne)
- Utworzyć `backend/.env.example` (backend-specific)
- Utworzyć `frontend/.env.example` (frontend-specific, VITE_*)

### 5. Zweryfikować `backend/package.json` dependencies
**Lokalizacja:** `backend/package.json`
**Problem:** README deklaruje pakiety (better-sqlite3, sharp, pino, zod, node-cron), ale mogą nie być w `dependencies`.
**Rozwiązanie:**
- Dodać brakujące pakiety do `dependencies`
- Upewnić się, że wersje się zgadzają z README
- Usunąć nieużywane pakiety

### 6. Naprawić JWT refresh token flow
**Lokalizacja:** `backend/services/auth.service.js`, `backend/middleware/auth.js`
**Problem:** README deklaruje refresh token w httpOnly cookie, ale implementacja może tego nie robić poprawnie.
**Rozwiązanie:**
- Access token: zwracany w JSON (15 min)
- Refresh token: zwracany jako `httpOnly`, `Secure`, `SameSite=strict` cookie (7 dni)
- Endpoint `/api/v2/auth/refresh`: czyta refresh z cookie, generuje nowy access
- Logout: czyści cookie (`Max-Age=0`)
- Frontend: `fetch` z `credentials: 'include'`

### 7. Zarejestrować Web Components w entry pointach
**Lokalizacja:** `frontend/src/main.js`, `frontend/src/app/admin/app.js`
**Problem:** Komponenty UI (`btn.js`, `card.js`, `input.js`, `modal.js`, `select.js`, `skeleton.js`, `textarea.js`, `toast.js`, `tooltip.js`, `faq-item.js`, `pricing-card.js`, `process-step.js`) nie są rejestrowane w `customElements`.
**Rozwiązanie:**
- Dodać w `main.js` importy i rejestrację komponentów
- Lub utworzyć `frontend/src/app/components/register.js` i zaimportować w entry pointach

### 8. Podłączyć frontend do API v2
**Lokalizacja:** `frontend/src/app/core/renderer.js`, sekcje
**Problem:** Frontend może czytać hardcoded `content.json` lub stare endpointy zamiast `/api/v2/content/pages/home`.
**Rozwiązanie:**
- `renderer.js`: fetch `/api/v2/content/pages/home` z fallbackiem do lokalnego JSON
- Sekcje: renderować dynamicznie z danych API
- Dodać skeleton loading podczas fetch

---

## 🟡 Wysokie (tydzień 1-2)

### 9. Dodać indeksy SQL w migracjach
**Lokalizacja:** `backend/db/migrations/001_init.sql`
**Rozwiązanie:**
```sql
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_pages_slug ON pages(slug);
CREATE INDEX idx_contacts_created ON contacts(created_at);
CREATE INDEX idx_revisions_page ON revisions(page_id);
CREATE INDEX idx_media_filename ON media(filename);
```

### 10. Naprawić seed data (dynamiczne hasło admina)
**Lokalizacja:** `backend/db/seeds/001_demo_data.sql`
**Problem:** Hasło admina może być hardcoded w SQL.
**Rozwiązanie:**
- Seed powinien czytać `ADMIN_PASSWORD` z `.env`
- Hashować przez `bcrypt` w skrypcie `seed.js` (nie w SQL)

### 11. Ukończyć routing admin panelu
**Lokalizacja:** `frontend/src/app/admin/app.js`
**Problem:** Admin panel jest "w toku", brak kompletnego routinga.
**Rozwiązanie:**
- Dashboard (`/admin`)
- Content Manager (`/admin/content`)
- Media Library (`/admin/media`)
- Settings (`/admin/settings`)
- User Management (`/admin/users`)

### 12. Podłączyć i18n do sekcji
**Lokalizacja:** `frontend/src/app/core/i18n.js`, sekcje
**Problem:** Pliki `pl.json` / `en.json` istnieją, ale system i18n nie jest używany.
**Rozwiązanie:**
- Zainicjalizować i18n w `main.js`
- Używać `i18n.t('key')` w sekcjach zamiast hardcoded stringów
- Dodać przełącznik języka w nawigacji

### 13. Dodać error handling w backup cron
**Lokalizacja:** `backend/jobs/backup.cron.js`
**Problem:** Cron może crashować przy błędzie (brak miejsca, brak uprawnień).
**Rozwiązanie:**
- Try/catch w całym ciele cron job
- Logowanie błędów przez Pino (nie console.error)
- Wysyłanie alertu email przy błędzie backupu (opcjonalnie)

### 14. Skonfigurować CORS poprawnie
**Lokalizacja:** `backend/config/config.js`, `backend/app.js`
**Problem:** Frontend (Vite dev / Nginx) i backend mogą mieć konflikty origin.
**Rozwiązanie:**
- Dev: `CORS_ORIGIN=http://localhost:5173`
- Prod: `CORS_ORIGIN=https://twojadomena.pl`
- Walidacja: w produkcji `*` jest zakazane
- Preflight dla `PATCH`, `DELETE`

---

## 🟢 Średnie (tydzień 3-4)

### 15. Dodać testy
**Stack:** Jest + Supertest + Playwright
**Do przetestowania:**
- Unit: `auth.service.js`, `content.service.js`, `helpers.js`
- Integration: `POST /api/v2/auth/login`, `POST /api/v2/contact` (rate limit)
- E2E: login, formularz kontaktowy, edycja CMS

### 16. Stworzyć skrypty `install.sh` i `cleanup.sh`
**Lokalizacja:** Root
**install.sh:** Czysta instalacja jednym poleceniem (sprawdza Docker, kopiuje .env, build, start)
**cleanup.sh:** Usuwa niechciane pliki (node_modules, dist, logi, stare backupy)

### 17. Uzupełnić `docs/DEPLOYMENT.md` o pełny CI/CD
**Do dodania:**
- GitHub Actions workflow (build → test → deploy)
- Lighthouse CI w PR
- Automated backup przed deployem

### 18. Dodać Service Worker (PWA)
**Lokalizacja:** `frontend/public/sw.js`
**Funkcjonalność:**
- Cache static assets
- Offline fallback page
- Background sync dla formularza kontaktowego

### 19. Dynamiczne meta tagi (SEO)
**Lokalizacja:** `frontend/src/main.js` lub SSR
**Problem:** `<title>` i `<meta description>` są statyczne.
**Rozwiązanie:**
- Pobierać z `/api/v2/settings/public`
- Aktualizować DOM head dynamicznie

### 20. Sitemap.xml generator
**Lokalizacja:** `backend/` lub build-time
**Rozwiązanie:**
- Endpoint `/sitemap.xml` generujący XML z listą stron
- Lub generator w skrypcie build

---

## 🔵 Niskie (przyszłość)

### 21. Analytics
- Google Analytics 4
- Meta Pixel
- Hotjar / Microsoft Clarity (heatmap)

### 22. Newsletter
- Integracja z Mailchimp / Brevo
- Formularz newslettera w footerze

### 23. Multi-tenancy
- Wsparcie dla wielu stron (nie tylko `home`)
- Custom domains per page

### 24. WebSocket (real-time)
- Live preview w adminie
- Real-time notifications

### 25. GraphQL (opcjonalnie)
- Alternatywa dla REST API v2
- Apollo Client na frontendzie

---

*Lista zadań wersji 2.0.0 – aktualizowana na bieżąco*
