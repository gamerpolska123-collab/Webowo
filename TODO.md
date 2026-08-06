# TODO – Aktualne zadania

> **Wersja:** 2.0.0  
> **Ostatnia aktualizacja:** 2026-08-06  
> **Status:** Stabilne – Tura 6 zakończona (hotfix i18n + layout footer)

---

## Legenda

| Priorytet | Znaczenie | Kiedy |
|-----------|-----------|-------|
| 🔴 | Krytyczne – blokuje uruchomienie | Natychmiast |
| 🟡 | Wysokie – pogarsza UX / utrudnia rozwój | Tydzień 1-2 |
| 🟢 | Średnie – do poprawy przy okazji | Tydzień 3-4 |
| 🔵 | Niskie – nice to have | Przyszłość |

---

## ✅ Zrealizowane (Etap 5 – Backend Modernizacja + Tury 4-6)

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
| 18 | Ukończono widoki admin panelu (CRUD) | ✅ Content, Media, Contacts, Settings, Users, Backups (Tura 1) |
| 19 | System i18n (PL/EN) | ✅ 82 kluczy, przełącznik w nav działa (Tura 2-3) |
| 20 | Landing page na `t('key')` | ✅ 9 sekcji przepisanych (Tura 3) |
| 21 | Walidacja formularza kontaktowego (frontend) | ✅ Honeypot, walidacja pól, błędy per field, toast (Tura 4) |
| 22 | Animacje sekcji przy scrollu | ✅ IntersectionObserver + CSS `.animate-fade-up/in/stagger` (Tura 4) |
| 23 | Counter animation dla sekcji About | ✅ Animacja liczb 0→docelowa, ~1.5s ease-out (Tura 4) |
| 24 | Optymalizacja obrazków (lazy loading + srcset) | ✅ `loading="lazy"`, `srcset` z wariantami Sharp, blur-up placeholder (Tura 5) |
| 25 | Logowanie GDPR consent | ✅ Osobny plik `gdpr-consents.log`, retencja 365 dni, auto-cleanup (Tura 5) |
| 26 | Dokumentacja CI/CD (GitHub Actions) | ✅ Pełny workflow: test → lighthouse → docker build → deploy VPS (Tura 5) |
| 27 | Hotfix i18n – statyczny import JSON | ✅ `import pl from '../../assets/i18n/pl.json'` – eliminacja 404 (Tura 6) |
| 28 | Layout footer na `t('key')` | ✅ Nawigacja i tagline w footerze używają tłumaczeń (Tura 6) |

---

## 🟡 Wysokie (Etap 6-7 – Admin Panel + UX)

### 1. Ukończyć widoki admin panelu
**Lokalizacja:** `frontend/src/app/admin/app.js`  
**Status:** ✅ Layout + sidebar gotowe, wszystkie widoki CRUD działają.

### 2. Podłączyć i18n do sekcji landing page ✅ (Tura 3)
**Lokalizacja:** `frontend/src/app/sections/*/*.js`  
**Status:** Wszystkie sekcje przepisane na `t('key')`. Przełącznik PL/EN w nav działa.

### 3. Dokończyć testy E2E (Playwright)
**Lokalizacja:** `frontend/e2e/`  
**Do zrobienia:**
- Login flow (admin)
- Edycja treści w CMS
- Upload obrazka
- Formularz kontaktowy (rate limit)

---

## 🟢 Średnie (tydzień 3-4)

### 4. Dodać pełne testy jednostkowe
**Stack:** Jest + Supertest + Playwright  
**Do przetestowania:**
- Unit: `auth.service.js`, `content.service.js`, `media.service.js`, `helpers.js`
- Integration: rate limiting, upload, contact form
- E2E: krytyczne ścieżki użytkownika

### 5. Stworzyć skrypt `install.sh`
**Lokalizacja:** Root  
**Status:** ✅ Utworzony. Wymaga testowania na czystym systemie.

### 6. Uzupełnić `docs/DEPLOYMENT.md` o pełny CI/CD ✅ (Tura 5)
**Status:** Zaimplementowano – workflow GitHub Actions z testami, Lighthouse CI, build Docker, deploy VPS.

### 7. Dodać logowanie GDPR consent ✅ (Tura 5)
**Lokalizacja:** `backend/services/contact.service.js`  
**Status:** Zaimplementowano – log `gdpr-consents.log`, retencja 365 dni, auto-cleanup co 100 zapisów.

### 8. Optymalizacja obrazków (lazy loading) ✅ (Tura 5)
**Lokalizacja:** `frontend/src/app/sections/portfolio/portfolio.js`  
**Status:** Zaimplementowano – `loading="lazy"`, `srcset` z wariantami Sharp, blur-up placeholder.

---

## 🔵 Niskie (przyszłość)

### 9. Analytics
- Google Analytics 4
- Meta Pixel
- Hotjar / Microsoft Clarity (heatmap)

### 10. Newsletter
- Integracja z Mailchimp / Brevo
- Formularz newslettera w footerze
- Double opt-in

### 11. Multi-tenancy
- Wsparcie dla wielu stron (nie tylko `home`)
- Custom domains per page

### 12. WebSocket (real-time)
- Live preview w adminie
- Real-time notifications

### 13. GraphQL (opcjonalnie)
- Alternatywa dla REST API v2
- Apollo Client na frontendzie

### 14. Newsletter + Blog
- System blogowy (posts, categories, tags)
- RSS feed
- SEO dla postów

---

*Lista zadań wersji 2.0.0 – aktualizowana na bieżąco*
