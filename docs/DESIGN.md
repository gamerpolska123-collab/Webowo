# Design System – Webowo v3.0

> **Wersja:** 3.0.1
> **Ostatnia aktualizacja:** 2026-08-09

---

## Spis treści

1. [Filozofia designu](#filozofia-designu)
2. [Kolory](#kolory)
3. [Typografia](#typografia)
4. [Spacing](#spacing)
5. [Shadows](#shadows)
6. [Border radius](#border-radius)
7. [Breakpoints](#breakpoints)
8. [Dark mode](#dark-mode)
9. [Komponenty](#komponenty)
10. [Sekcje](#sekcje)

---

## Filozofia designu

Webowo v3.0 opiera się na podejściu **"clean & professional"**:
- Minimalizm z akcentami koloru
- Duża typografia dla hierarchii
- Generous whitespace
- Subtelne animacje (60fps)
- Mobile-first responsive

---

## Kolory

### Primary
| Token | Wartość | Użycie |
|-------|---------|--------|
| `--color-primary-50` | `#eff6ff` | Tła hover |
| `--color-primary-100` | `#dbeafe` | Lekkie akcenty |
| `--color-primary-200` | `#bfdbfe` | Border aktywny |
| `--color-primary-300` | `#93c5fd` | Focus ring |
| `--color-primary-400` | `#60a5fa` | Linki |
| `--color-primary-500` | `#005ce6` | Primary buttons, brand |
| `--color-primary-600` | `#004bbd` | Hover primary |
| `--color-primary-700` | `#003d9a` | Active primary |

### Accent (Teal)
| Token | Wartość | Użycie |
|-------|---------|--------|
| `--color-accent-500` | `#00d4aa` | Badge, success states |
| `--color-accent-600` | `#00b894` | Hover accent |

### Neutral
| Token | Wartość | Użycie |
|-------|---------|--------|
| `--color-bg` | `#ffffff` | Tło strony (light) |
| `--color-surface` | `#f8fafc` | Tło sekcji |
| `--color-surface-elevated` | `#ffffff` | Karty, modale |
| `--color-border` | `#e2e8f0` | Border default |
| `--color-text` | `#0f172a` | Główny tekst |
| `--color-muted` | `#64748b` | Tekst pomocniczy |

### Semantic
| Token | Wartość | Użycie |
|-------|---------|--------|
| `--color-success` | `#00d4aa` | Sukces, toast |
| `--color-error` | `#ef4444` | Błąd, walidacja |
| `--color-warning` | `#f59e0b` | Ostrzeżenie |
| `--color-info` | `#3b82f6` | Informacja |

---

## Typografia

| Token | Wartość | Użycie |
|-------|---------|--------|
| `--font-sans` | `Inter, system-ui, sans-serif` | Główna czcionka |
| `--text-xs` | `0.75rem` | Etykiety, timestamp |
| `--text-sm` | `0.875rem` | Body secondary |
| `--text-base` | `1rem` | Body default |
| `--text-lg` | `1.125rem` | Lead text |
| `--text-xl` | `1.25rem` | H4 |
| `--text-2xl` | `1.5rem` | H3 |
| `--text-3xl` | `1.875rem` | H2 mobile |
| `--text-4xl` | `2.25rem` | H2 desktop |
| `--text-5xl` | `3rem` | H1 mobile |
| `--text-6xl` | `3.75rem` | H1 desktop |

---

## Spacing

| Token | Wartość |
|-------|---------|
| `--space-1` | `0.25rem` (4px) |
| `--space-2` | `0.5rem` (8px) |
| `--space-3` | `0.75rem` (12px) |
| `--space-4` | `1rem` (16px) |
| `--space-5` | `1.25rem` (20px) |
| `--space-6` | `1.5rem` (24px) |
| `--space-8` | `2rem` (32px) |
| `--space-10` | `2.5rem` (40px) |
| `--space-12` | `3rem` (48px) |
| `--space-16` | `4rem` (64px) |
| `--space-20` | `5rem` (80px) |
| `--space-24` | `6rem` (96px) |

---

## Shadows

| Token | Wartość |
|-------|---------|
| `--shadow-sm` | `0 1px 2px rgba(0,0,0,0.05)` |
| `--shadow-md` | `0 4px 6px rgba(0,0,0,0.07)` |
| `--shadow-lg` | `0 10px 15px rgba(0,0,0,0.1)` |
| `--shadow-xl` | `0 20px 25px rgba(0,0,0,0.1)` |
| `--shadow-2xl` | `0 25px 50px rgba(0,0,0,0.15)` |

---

## Border radius

| Token | Wartość |
|-------|---------|
| `--radius-sm` | `0.375rem` (6px) |
| `--radius-md` | `0.5rem` (8px) |
| `--radius-lg` | `0.75rem` (12px) |
| `--radius-xl` | `1rem` (16px) |
| `--radius-2xl` | `1.5rem` (24px) |
| `--radius-full` | `9999px` |

---

## Breakpoints

| Nazwa | Wartość |
|-------|---------|
| `sm` | `640px` |
| `md` | `768px` |
| `lg` | `1024px` |
| `xl` | `1280px` |
| `2xl` | `1536px` |

---

## Dark mode

Automatyczne wykrywanie przez `prefers-color-scheme: dark`.

Kluczowe zmiany:
- `--color-bg` → `#0f172a`
- `--color-surface` → `#1e293b`
- `--color-text` → `#f1f5f9`
- `--color-muted` → `#94a3b8`
- `--color-border` → `#334155`

---

## Komponenty

### Button
- Padding: `--space-4` `--space-8`
- Border radius: `--radius-xl`
- Font weight: 700
- Transition: `transform`, `box-shadow` 150ms

### Card
- Background: `--color-surface-elevated`
- Border: 1px solid `--color-border`
- Border radius: `--radius-2xl`
- Shadow: `--shadow-md`

### Input
- Border: 2px solid `--color-border`
- Border radius: `--radius-xl`
- Focus: border `--color-primary-400`, ring 3px `#005ce61a`

---

## Sekcje

| Sekcja | ID | Typ |
|--------|-----|-----|
| Hero | `hero` | `webowo-section-hero` |
| About | `about` | `webowo-section-about` |
| Services | `services` | `webowo-section-services` |
| Portfolio | `portfolio` | `webowo-section-portfolio` |
| Process | `process` | `webowo-section-process` |
| Pricing | `pricing` | `webowo-section-pricing` |
| FAQ | `faq` | `webowo-section-faq` |
| Contact | `contact` | `webowo-section-contact` |
| Footer | `footer` | `webowo-section-footer` |
