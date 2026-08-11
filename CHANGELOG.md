# Changelog

## [3.0.1] – 2026-08-09

### Fixed
- Backend: Added missing `express-validator` dependency (login 500 error)
- Backend: Synchronized `001_init.sql` and `schema.sql` column names (`last_login`)
- Backend: Seed now creates default sections for home page (fixes 404 on `/api/v2/content/pages/home`)
- Backend: `contact.model.js` now persists `phone`, `ip`, `user_agent` fields
- Backend: `media.model.js` now persists `variants`, `alt_text` fields
- Backend: `section.model.js` guards against double JSON stringify in `update()`
- Backend: Auth routes set `httpOnly` refresh token cookie (login, refresh, logout)
- Backend: Added `POST /api/v2/auth/register` endpoint and `register()` service method
- Backend: Synchronized `.env.example` variable names with `config.js` (`CMS_BACKUP_DIR`, `CMS_MAX_BACKUPS`, `GDPR_LOG_RETENTION_DAYS`)
- Frontend: `renderer.js` handles both string and object `section.data` (prevents JSON.parse crash)
- Frontend: `router.js` normalizes hash routes (`#about` -> `/about` mapping)
- Frontend: `hero.js` re-initializes particles after language change; cleans up resize listener on disconnect (memory leak fix)
- Frontend: `about.css` cleaned from duplicated hero styles
- Frontend: CSP updated to allow Google Fonts (`connect-src`)
- Frontend: Service Worker skips external resources (prevents CSP violations)
- Frontend: `manifest.json` uses SVG icon instead of missing PNGs

## [3.0.0] – 2026-08-06

### Added
- Kompletny redesign frontendu (Webowo v3.0)
- Design system z tokenami CSS (colors, spacing, typography, shadows)
- Dark mode z automatycznym wykrywaniem systemowego
- Lenis smooth scroll engine
- Particle system w sekcji Hero (Canvas 2D)
- Scroll-triggered animations (IntersectionObserver)
- Magnetic buttons, parallax effects
- Professional navigation: sticky, scroll-aware, progress bar, mobile overlay
- Portfolio z filtrowaniem kategorii
- FAQ z wyszukiwaniem i akordeonem
- Pricing z toggle monthly/yearly (-20%)
- Contact form z walidacją real-time, toast feedback
- Toast system z auto-dismiss, progress bar, pause on hover
- Modal z focus trap, keyboard support
- Skeleton loading z shimmer effect
- Tooltip, Badge, Accordion Web Components
- Service Worker z cache-first + stale-while-revalidate
- Enhanced PWA manifest z screenshots
- Backend: Winston logger z DailyRotateFile
- Backend: Structured request logging z request ID
- Backend: Graceful shutdown (SIGTERM/SIGINT)
- Backend: Environment validation
- Backend: Media upload z Sharp (resize variants)
- Backend: Backup service z retention policy
- Backend: Revision system dla treści
- Backend: Sitemap.xml i robots.txt generowane dynamicznie
- Backend: Privacy-first analytics endpoint
- Admin panel: dark theme, responsive sidebar, dashboard stats
- Makefile, install.sh, cleanup.sh
- Docker Compose z healthcheck

### Changed
- Przepisano wszystkie sekcje (Hero, About, Services, Portfolio, Process, Pricing, FAQ, Contact, Footer)
- Przepisano wszystkie komponenty UI
- Przepisano core (router, state, i18n, animations, renderer)
- Przepisano backend app.js z pełnym security stack
- Przepisano config.js z walidacją i defaults
- Zaktualizowano package.json (frontend i backend)

### Security
- Helmet CSP z nonce-ready config
- JWT z issuer/audience verification
- Refresh token rotation
- Rate limiting tiered (global/api/auth/contact)
- Input sanitization (xss-clean, express-mongo-sanitize)
- HPP protection
- CORS z origin whitelist
- bcrypt rounds configurable

### Fixed
- Brakujące pliki models, services, middleware
- Niekompletny admin panel
- Brak obsługi błędów w rendererze
