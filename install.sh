#!/bin/bash
set -e

echo "🚀 Webowo v2.0 – Czysta instalacja"
echo "===================================="

# Check requirements
command -v docker >/dev/null 2>&1 || { echo "❌ Docker jest wymagany"; exit 1; }
command -v docker compose >/dev/null 2>&1 || { echo "❌ Docker Compose jest wymagany"; exit 1; }

# Configuration
if [ ! -f .env ]; then
  cp .env.example .env
  echo "📝 Utworzono .env – EDYTUJ GO TERAZ!"
  echo "   Wymagane: JWT_SECRET, JWT_REFRESH_SECRET, ADMIN_PASSWORD"
  exit 0
fi

# Validate secrets
if grep -q 'change-me-in-production-please' .env; then
  echo "⚠️  UWAGA: Domyślne sekrety JWT w .env! Zmień je przed uruchomieniem."
  exit 1
fi

# Build & run
echo "🔧 Budowanie i uruchamianie..."
docker compose up --build -d

# Wait for healthcheck
echo "⏳ Czekam na gotowość serwisów..."
sleep 10

# Status
docker compose ps

echo ""
echo "✅ Instalacja zakończona!"
echo "   Strona:    http://localhost:7777"
echo "   Admin:     http://localhost:7777/admin"
echo "   API:       http://localhost:6666/api/v2"
echo "   Health:    http://localhost:6666/health"
echo ""
echo "📋 Logi:     docker compose logs -f backend"
echo "🗄️  Backup:   docker compose exec backend npm run backup"
