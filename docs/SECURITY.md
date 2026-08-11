# Bezpieczeństwo

> **Wersja:** 2.0.0  
> **Ostatnia aktualizacja:** 2026-08-06

---

## Spis treści

1. [Checklista pre-deployment](#checklista-pre-deployment)
2. [Autentykacja i autoryzacja](#autentykacja-i-autoryzacja)
3. [Walidacja danych](#walidacja-danych)
4. [Upload plików](#upload-plikow)
5. [Baza danych](#baza-danych)
6. [Logi i GDPR](#logi-i-gdpr)
7. [Nagłówki bezpieczeństwa](#naglowki-bezpieczenstwa)
8. [Rate limiting](#rate-limiting)
9. [Zgłaszanie podatności](#zglaszanie-podatnosci)

---

## Checklista pre-deployment

Przed wdrożeniem na produkcję upewnij się, że:

- [x] `JWT_SECRET` ma min. 64 znaki, losowo wygenerowane
- [x] `JWT_REFRESH_SECRET` ma min. 64 znaki, inne niż `JWT_SECRET`
- [x] `ADMIN_PASSWORD` zmienione z domyślnego, min. 12 znaków
- [x] `CORS_ORIGIN` ustawione na konkretną domenę (nie `*` w produkcji)
- [x] `helmet()` aktywne z pełną konfiguracją CSP
- [x] Rate limiting włączone na wszystkich endpointach
- [x] Upload: whitelist MIME typów, max 5MB, Sharp sanityzacja
- [x] SQL: wyłącznie prepared statements (zero string concatenation)
- [x] Logi: brak haseł, tokenów, sekretów w logach aplikacji
- [x] GDPR: consent logowanie aktywne dla formularza kontaktowego
- [x] HTTPS wymuszony (Nginx redirect 80→443 + HSTS)
- [x] Backup cron działa i testowo przywrócono backup
- [x] `.env` nie jest commitowany do repozytorium
- [x] `node_modules` nie jest commitowany
- [x] Kontener Docker działa jako non-root user

---

## Autentykacja i autoryzacja

### JWT Flow

```
Login → Access Token (15 min, Bearer header)
      → Refresh Token (7 dni, httpOnly Secure SameSite=Strict cookie)

Access wygasa → POST /api/v2/auth/refresh (cookie)
                → Nowy Access Token

Logout → POST /api/v2/auth/logout
       → Cookie refreshToken usunięty (Max-Age=0)
       → Token usunięty z bazy danych
```

### Zasady

1. **Access token** nigdy nie jest zapisywany w `localStorage` – tylko w pamięci (zmienna JS).
2. **Refresh token** jest niedostępny dla JS (httpOnly) – chroni przed XSS.
3. **SameSite=Strict** zapobiega CSRF przy przesyłaniu cookie.
4. **Secure** wymaga HTTPS – cookie nie jest wysyłane przez HTTP.
5. **Refresh rotation** – przy każdym refresh generowany jest nowy refresh token, stary jest unieważniany.

### Role

| Rola | Uprawnienia |
|------|-------------|
| `admin` | Pełne: CRUD wszystkiego, backupy, ustawienia, users |
| `editor` | Edycja treści, media, kontakty (bez backupów, bez users) |
| `viewer` | Tylko podgląd (przyszłość) |

---

## Walidacja danych

### Zod Schemas

Każdy endpoint przyjmujący dane używa Zod do walidacji:

```javascript
// Przykład walidacji kontaktu
const contactSchema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email().max(254),
  phone: z.string().regex(/^\+?[\d\s-]{9,20}$/).optional(),
  service: z.enum(['website', 'shop', 'app', 'optimization', 'other']),
  message: z.string().max(2000),
  gdpr: z.literal(true),
  honeypot: z.literal('').optional() // anti-bot
});
```

### Sanitizacja

- `escapeHtml()` dla wszystkich danych wyświetlanych w HTML
- `trim()` dla stringów
- `toLowerCase()` dla emaili
- Maksymalne długości pól egzekwowane przez Zod

---

## Upload plików

### Zabezpieczenia

| Mechanizm | Implementacja |
|-----------|---------------|
| Whitelist MIME | `['image/jpeg', 'image/png', 'image/webp', 'image/avif', 'image/svg+xml']` |
| Max rozmiar | 5 MB |
| Sanityzacja nazwy | `path.basename()` + `uuid` prefix |
| Przetwarzanie | Sharp generuje warianty, oryginał opcjonalnie usuwany |
| Storage | Poza web root (dostęp tylko przez API / Nginx) |

### Anti-virus (przyszłość)

```bash
# Integracja z ClamAV
clamscan --infected uploads/
```

---

## Baza danych

### SQL Injection Prevention

- **Tylko** prepared statements przez `better-sqlite3`
- **Zakaz** string concatenation w zapytaniach SQL
- **Przykład poprawny:**
  ```javascript
  db.prepare('SELECT * FROM users WHERE email = ?').get(email);
  ```
- **Przykład ZAKAZANY:**
  ```javascript
  db.prepare(`SELECT * FROM users WHERE email = '${email}'`).get(); // ❌
  ```

### Indeksy bezpieczeństwa

```sql
-- Unikalność krytycznych pól
CREATE UNIQUE INDEX idx_users_email ON users(email);
CREATE UNIQUE INDEX idx_pages_slug ON pages(slug);

-- Szybkie wyszukiwanie
CREATE INDEX idx_contacts_created ON contacts(created_at);
CREATE INDEX idx_revisions_page ON revisions(page_id);
CREATE INDEX idx_media_filename ON media(filename);
CREATE INDEX idx_refresh_tokens_token ON refresh_tokens(token);
```

---

## Logi i GDPR

### Co logujemy

| Typ | Zawartość | Cel |
|-----|-----------|-----|
| `app` | Request method, path, status, IP | Monitoring |
| `error` | Stack trace (bez danych osobowych) | Debugowanie |
| `gdpr-consent` | Timestamp, IP, user-agent, consent text | RODO compliance |
| `email` | To, status, messageId | Potwierdzenie wysyłki |

### Czego NIE logujemy

- Haseł (nigdy, nawet w formie hash)
- Tokenów JWT (access ani refresh)
- Treści wiadomości kontaktowych (poza GDPR consent log)
- Numerów kart płatniczych (nie dotyczy tego projektu, ale jako zasada)

### Retencja

- Logi aplikacji: 30 dni
- Logi GDPR consent: 365 dni (lub zgodnie z polityką)
- Backupy: 30 dni (konfigurowalne)

---

## Nagłówki bezpieczeństwa

### Helmet konfiguracja

```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      connectSrc: ["'self'", "https://api.twojadomena.pl"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### Dodatkowe nagłówki (Nginx)

```nginx
add_header X-Frame-Options "SAMEORIGIN" always;
add_header X-Content-Type-Options "nosniff" always;
add_header Referrer-Policy "strict-origin-when-cross-origin" always;
add_header Permissions-Policy "geolocation=(), microphone=(), camera=()" always;
```

---

## Rate Limiting

| Warstwa | Limit | Okno | Endpointy |
|---------|-------|------|-----------|
| Global | 100 req | 15 min | Wszystkie |
| Auth | 10 req | 15 min | `/api/v2/auth/*` |
| Contact | 5 req | 1h | `POST /api/v2/contact` |
| Upload | 20 req | 15 min | `POST /api/v2/media` |

**Po przekroczeniu:**
```json
{
  "success": false,
  "error": "Zbyt wiele żądań. Spróbuj ponownie za 15 minut.",
  "retryAfter": 900
}
```

---

## Zgłaszanie podatności

**Nie publikuj publicznie!**

Jeśli znajdziesz lukę bezpieczeństwa:

1. Napisz na: `security@twojadomena.pl`
2. Dołącz:
   - Opis luki
   - Kroki reprodukcji
   - Możliwy wpływ (impact)
   - Sugestię naprawy (opcjonalnie)
3. Daj nam 90 dni na naprawę przed publicznym ujawnieniem

---

*Polityka bezpieczeństwa wersji 2.0.0*
