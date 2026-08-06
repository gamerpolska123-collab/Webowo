# TODO – Aktualne zadania

> **Wersja:** 2.0.0  
> **Ostatnia aktualizacja:** 2026-08-06  
> **Status:** Stabilne – Etap 5 zakończony, Tura 1 (Admin Panel CRUD) zakończona

---

## Legenda

| Priorytet | Znaczenie | Kiedy |
|-----------|-----------|-------|
| 🔴 | Krytyczne – blokuje uruchomienie | Natychmiast |
| 🟡 | Wysokie – pogarsza UX / utrudnia rozwój | Tydzień 1-2 |
| 🟢 | Średnie – do poprawy przy okazji | Tydzień 3-4 |
| 🔵 | Niskie – nice to have | Przyszłość |

---

## ✅ Zrealizowane (Etap 5 – Backend Modernizacja)

| # | Zadanie | Status |
|---|---------|--------|
| 1 | Usunięto duplikaty sekcji frontendu | ✅ Wszystkie sekcje w podkatalogach `sections/*/` |
| 2 | Ujednolicono lokalizację styli CSS | ✅ Co-location – każda sekcja ma własny `.css` |
| 3 | Zsynchronizowano wersje | ✅ `2.0.0` we wszystkich `package.json`, `VERSION`, `CHANGELOG.md` |
| 4 | Uzupełniono `.env.example` | ✅ Root, `backend/`, `frontend/` – kompletne |
| 5 | Zweryfikowano `backend/package.json` dependencies | ✅ Wszystkie pakiety zadeklarowane i zainstalowane |
| 6 | Naprawiono JWT refresh token flow | ✅ httpOnly cookie, `/refresh`, `/logout` |
| 7 | Zarejestrowano Web Components | ✅ Wszystkie komponenty w `main.js` i `admin-main.js` |
| 8 | Podłączono frontend do API v2 | ✅ `renderer.js` fetchuje `/api/v2/content/pages/home` z fallbackiem |
| 9 | Dodano indeksy SQL | ✅ W migracjach `001_init.sql` |
| 10 | Naprawiono seed data | ✅ Dynamiczne hasło admina z `.env` (bcrypt) |
| 11 | Skonfigurowano CORS | ✅ Walidacja origin, credentials, metody |
| 12 | Dodano testy (podstawowe) | ✅ `auth.test.js`, `content.test.js` |
| 13 | Dodano obsługę błędów w backup cron | ✅ Try/catch + Pino logging |
| 14 | Dodano Service Worker (PWA) | ✅ `sw.js` z cache static assets |
| 15 | Dynamiczne meta tagi | ✅ `main.js` fetchuje `/api/v2/settings/public` |
| 16 | Sitemap.xml | ✅ Endpoint `/sitemap.xml` |
| 17 | Upload + Sharp warianty | ✅ `media.service.js` generuje thumb/medium/large WebP |

---

## 🟡 Wysokie (Etap 6-7 – Admin Panel + UX)

### 1. Ukończyć widoki admin panelu
**Lokalizacja:** `frontend/src/app/admin/app.js`  
**Status:** Layout + sidebar gotowe, brak pełnych widoków CRUD.
**Do zrobienia:**
- [x] Content Manager – lista stron, edycja sekcji, reorder, publish, revisions/rollback ✅ (Tura 1)
- [x] Media Library – lista z podglądem, usuwanie ✅ (Tura 1)
- [x] Contacts – lista, zmiana statusu, usuwanie ✅ (Tura 1)
- [x] Settings – edycja inline, zapis per key ✅ (Tura 1)
- [ ] User Management – lista użytkowników, role (admin/editor)
- [x] Backup Manager – lista, tworzenie, przywracanie, pobieranie ✅ (Tura 1)

### 2. Podłączyć i18n do sekcji landing page
**Lokalizacja:** `frontend/src/app/sections/*/*.js`  
**Problem:** Sekcje używają hardcoded stringów zamiast `i18n.t('key')`.  
**Rozwiązanie:**
- Przepisać wszystkie stringi w sekcjach na klucze i18n
- Rozszerzyć `pl.json` / `en.json` o brakujące klucze
- Dodać przełącznik języka w nawigacji

### 3. Dodać walidację formularza kontaktowego (frontend)
**Lokalizacja:** `frontend/src/app/sections/contact/contact.js`  
**Do zrobienia:**
- Walidacja email, phone, required fields
- Honeypot anti-bot
- Wyświetlanie błędów walidacji (Zod-like)
- Toast sukces/błąd po submit

### 4. Dodać animacje sekcji (IntersectionObserver)
**Lokalizacja:** `frontend/src/app/core/animations.js`  
**Do zrobienia:**
- Stagger animation dla sekcji przy scrollu
- Parallax dla hero
- Counter animation dla statystyk (about)

### 5. Dokończyć testy E2E (Playwright)
**Lokalizacja:** `frontend/e2e/`  
**Do zrobienia:**
- Login flow (admin)
- Edycja treści w CMS
- Upload obrazka
- Formularz kontaktowy (rate limit)

---

## 🟢 Średnie (tydzień 3-4)

### 6. Dodać pełne testy jednostkowe
**Stack:** Jest + Supertest + Playwright  
**Do przetestowania:**
- Unit: `auth.service.js`, `content.service.js`, `media.service.js`, `helpers.js`
- Integration: rate limiting, upload, contact form
- E2E: krytyczne ścieżki użytkownika

### 7. Stworzyć skrypt `install.sh`
**Lokalizacja:** Root  
**Status:** ✅ Utworzony. Wymaga testowania na czystym systemie.

### 8. Uzupełnić `docs/DEPLOYMENT.md` o pełny CI/CD
**Do dodania:**
- GitHub Actions workflow (build → test → deploy)
- Lighthouse CI w PR
- Automated backup przed deployem
- Instrukcja dla Raspberry Pi

### 9. Dodać logowanie GDPR consent
**Lokalizacja:** `backend/services/contact.service.js`  
**Do zrobienia:**
- Logowanie timestamp, IP, user-agent przy submit formularza
- Osobny plik logów: `gdpr-consents.log`
- Retencja 365 dni

### 10. Optymalizacja obrazków (lazy loading)
**Lokalizacja:** `frontend/src/app/sections/portfolio/portfolio.js`  
**Do zrobienia:**
- `loading="lazy"` dla obrazków
- `srcset` z wariantami Sharp
- Placeholder / blur-up effect

---

## 🔵 Niskie (przyszłość)

### 11. Analytics
- Google Analytics 4
- Meta Pixel
- Hotjar / Microsoft Clarity (heatmap)

### 12. Newsletter
- Integracja z Mailchimp / Brevo
- Formularz newslettera w footerze
- Double opt-in

### 13. Multi-tenancy
- Wsparcie dla wielu stron (nie tylko `home`)
- Custom domains per page

### 14. WebSocket (real-time)
- Live preview w adminie
- Real-time notifications

### 15. GraphQL (opcjonalnie)
- Alternatywa dla REST API v2
- Apollo Client na frontendzie

### 16. Newsletter + Blog
- System blogowy (posts, categories, tags)
- RSS feed
- SEO dla postów

---

*Lista zadań wersji 2.0.0 – aktualizowana na bieżąco*
