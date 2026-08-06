# Konwencje kodu i współpraca

> **Wersja:** 2.0.0

---

## Spis treści

1. [Git Workflow](#git-workflow)
2. [Conventional Commits](#conventional-commits)
3. [JavaScript](#javascript)
4. [CSS](#css)
5. [SQL](#sql)
6. [Code Review](#code-review)
7. [Definition of Done](#definition-of-done)

---

## Git Workflow

### Branching model

```
main          ← produkcja (tylko PR z review)
  │
  ├── feat/admin-sidebar     ← feature branch
  ├── fix/cors-origin        ← bugfix branch
  ├── docs/api-update        ← docs branch
  └── refactor/db-models     ← refactor branch
```

### Zasady

1. **Nigdy nie commituj bezpośrednio do `main`.**
2. Każda zmiana przez Pull Request.
3. PR wymaga:
   - Min. 1 approval
   - CI pass (lint + test)
   - Brak konfliktów

### Nazewnictwo branchy

| Prefix | Zastosowanie | Przykład |
|--------|-------------|----------|
| `feat/` | Nowa funkcjonalność | `feat/admin-sidebar` |
| `fix/` | Naprawa błędu | `fix/cors-origin` |
| `docs/` | Dokumentacja | `docs/api-update` |
| `refactor/` | Refaktoryzacja | `refactor/db-models` |
| `test/` | Testy | `test/auth-service` |
| `chore/` | Konfiguracja, deps | `chore/update-eslint` |

---

## Conventional Commits

```
<type>(<scope>): <description>

[optional body]

[optional footer]
```

### Typy

| Typ | Kiedy używać |
|-----|-------------|
| `feat` | Nowa funkcjonalność |
| `fix` | Naprawa błędu |
| `docs` | Zmiany w dokumentacji |
| `style` | Formatowanie, brak zmiany logiki |
| `refactor` | Refaktoryzacja kodu |
| `test` | Dodanie / poprawa testów |
| `chore` | Zależności, konfiguracja, build |

### Przykłady

```
feat(auth): add refresh token rotation

fix(contact): validate phone number format

docs(api): document rate limiting headers

refactor(db): extract reusable query builder

test(media): add Sharp variant generation tests
```

---

## JavaScript

### Styl

- **ES2024** – top-level await, Object.groupBy
- **JSDoc + `@ts-check`** – type safety bez TS overhead
- **Named exports** – zawsze, nigdy default export
- **Early returns** – unikamy zagnieżdżonych ifów
- **Pure functions** – gdzie to możliwe
- **Async/await** – nigdy `.then()` chains

### Przykład

```javascript
// @ts-check

/**
 * Oblicza cenę z VAT.
 * @param {number} netPrice – cena netto
 * @param {number} vatRate – stawka VAT (domyślnie 23%)
 * @returns {number} cena brutto
 */
export function calculateGrossPrice(netPrice, vatRate = 0.23) {
  if (netPrice < 0) {
    throw new Error('Cena netto nie może być ujemna');
  }
  return Math.round(netPrice * (1 + vatRate) * 100) / 100;
}
```

### Backend – dodatkowe zasady

- **Zod validation** – wszystkie requesty walidowane
- **Repository pattern** – modele jako warstwa dostępu do danych
- **Service layer** – logika biznesowa w services, nie w controllers
- **Dependency injection** – manualne, bez frameworka

---

## CSS

### Metodologia

- **CSS Layers** – `@layer base, components, sections, utilities;`
- **Container Queries** – tam gdzie to ma sens
- **Custom Properties** – wszystkie wartości z design tokens
- **BEM-like** – `.section__element--modifier`
- **No IDs in CSS** – zawsze klasy
- **Mobile-first**

### Przykład

```css
@layer sections {
  .hero {
    --hero-min-height: 100vh;
    display: grid;
    place-items: center;
    min-height: var(--hero-min-height);
    background: var(--color-bg-gradient);
  }

  .hero__title {
    font-size: var(--font-size-3xl);
    color: var(--color-text-primary);
  }

  .hero__title--accent {
    color: var(--color-accent);
  }
}

@media (min-width: 768px) {
  .hero__title {
    font-size: var(--font-size-4xl);
  }
}
```

---

## SQL

### Zasady

- **Tylko** prepared statements
- **Nigdy** string concatenation
- **Indeksy** na kolumnach wyszukiwania i UNIQUE
- **WAL mode** w SQLite
- **Foreign keys** włączone

### Przykład

```sql
-- Poprawnie
SELECT id, title, slug FROM pages WHERE slug = ? AND status = 'published';

-- ŹLE – nigdy tak nie rób!
SELECT id, title FROM pages WHERE slug = '${slug}'; -- SQL INJECTION RISK
```

---

## Code Review

### Checklist PR

- [ ] Kod spełnia konwencje (ESLint / Prettier pass)
- [ ] Zmiany są pokryte testami (lub uzasadnione wyjątki)
- [ ] Dokumentacja zaktualizowana (jeśli dotyczy)
- [ ] Brak console.log w kodzie produkcyjnym
- [ ] Brak hardcoded sekretów / haseł
- [ ] Zod schemas dla nowych endpointów
- [ ] Rate limiting dla nowych endpointów publicznych

### Kultura review

- **Konstruktywnie** – sugeruj, nie krytykuj
- **Pytaj** – "Dlaczego tak?" zamiast "To źle"
- **Uznaj** – approve gdy kod spełnia wymagania, nawet jeśli nie jest "idealny"
- **Ucz się** – review to okazja do nauki dla obu stron

---

## Definition of Done

Funkcjonalność jest "done" gdy:

1. Kod działa zgodnie z wymaganiami
2. Przeszedł code review
3. CI pass (lint + test)
4. Jest pokryty testami (unit / integration / E2E)
5. Dokumentacja zaktualizowana
6. Nie wprowadza regresji (manualny smoke test)
7. Security review (dla funkcji z auth / upload / payment)

---

*Konwencje kodu wersji 2.0.0*
