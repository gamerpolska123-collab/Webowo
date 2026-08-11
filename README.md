# Webowo v3.1

Nowoczesny, modułowy CMS do zarządzania stronami internetowymi. Zbudowany z myślą o łatwej rozbudowie i dostosowaniu do różnych projektów.

## 🚀 Funkcje

- **SPA Frontend** – Vanilla JS, Web Components, Vite
- **REST API** – Express.js, SQLite (better-sqlite3)
- **Admin Panel** – Zarządzanie sekcjami, wiadomościami, mediami, ustawieniami
- **Drag & Drop** – Zmiana kolejności sekcji
- **JWT Auth** – Bezpieczna autentykacja z refresh tokenami
- **Media Upload** – Sharp do generowania wariantów obrazów
- **Backup System** – Automatyczne kopie zapasowe z cron
- **Cookie Consent** – Zgodność z GDPR
- **PWA Ready** – Service Worker, Manifest
- **i18n** – Wsparcie dla wielu języków (PL/EN)
- **Rate Limiting** – Ochrona przed nadużyciami
- **Dark Theme Admin** – Nowoczesny ciemny interfejs administracyjny

## 📁 Struktura

```
Webowo/
├── backend/           # API Node.js + Express
│   ├── api/v2/       # Endpointy REST
│   ├── models/       # Modele danych
│   ├── services/     # Logika biznesowa
│   ├── middleware/    # Auth, rate limit, upload
│   └── db/           # Schema, migracje, seed
├── frontend/         # SPA Vanilla JS
│   ├── src/app/
│   │   ├── sections/ # Komponenty sekcji
│   │   ├── components/ # UI + Layout
│   │   ├── core/     # Router, State, i18n, Animations
│   │   └── admin/    # Panel administracyjny
│   └── public/       # SW, manifest, favicon
├── docker-compose.yml
└── .env
```

## 🐳 Docker

```bash
# 1. Skopiuj i wypełnij .env
cp .env.example .env

# 2. Uruchom
sudo docker compose up --build -d

# Frontend: http://localhost:7777
# Admin:     http://localhost:7777/admin.html
# API:       http://localhost:6666
```

## 🔧 Update Script

Użyj dostarczonego `update.sh` do aktualizacji serwera:
```bash
chmod +x update.sh
./update.sh
```

## 🛠️ Technologie

**Backend:** Node.js, Express, better-sqlite3, JWT, bcryptjs, sharp, multer, winston, node-cron, helmet, cors
**Frontend:** Vanilla JS, Web Components, Vite, CSS Custom Properties, Intersection Observer

## 📄 Licencja

MIT
