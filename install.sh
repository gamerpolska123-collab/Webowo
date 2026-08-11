#!/bin/bash
# ============================================
# Webowo v3.0 – Install Script
# ============================================

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}╔══════════════════════════════════════════╗${NC}"
echo -e "${BLUE}║     Webowo v3.0 – Instalator            ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════════╝${NC}"
echo ""

# Check Node.js version
NODE_VERSION=$(node -v 2>/dev/null | sed 's/v//')
if [ -z "$NODE_VERSION" ]; then
    echo -e "${RED}❌ Node.js nie jest zainstalowany${NC}"
    echo "   Zainstaluj Node.js 18+ z https://nodejs.org"
    exit 1
fi

NODE_MAJOR=$(echo $NODE_VERSION | cut -d. -f1)
if [ "$NODE_MAJOR" -lt 18 ]; then
    echo -e "${RED}❌ Wymagany Node.js 18+. Zainstalowana wersja: $NODE_VERSION${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Node.js $NODE_VERSION${NC}"

# Check npm
NPM_VERSION=$(npm -v 2>/dev/null)
if [ -z "$NPM_VERSION" ]; then
    echo -e "${RED}❌ npm nie jest zainstalowany${NC}"
    exit 1
fi
echo -e "${GREEN}✓ npm $NPM_VERSION${NC}"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✓ Docker dostępny${NC}"
    HAS_DOCKER=true
else
    echo -e "${YELLOW}⚠ Docker niedostępny (opcjonalne)${NC}"
    HAS_DOCKER=false
fi

echo ""
echo -e "${BLUE}📦 Instalacja zależności backendu...${NC}"
cd backend
npm install
cd ..

echo -e "${BLUE}📦 Instalacja zależności frontendu...${NC}"
cd frontend
npm install
cd ..

# Create .env if not exists
if [ ! -f .env ]; then
    echo -e "${BLUE}📝 Tworzenie pliku .env...${NC}"
    cat > .env << 'EOF'
NODE_ENV=development
PORT=3000
JWT_SECRET=change-me-in-production-$(openssl rand -hex 32)
JWT_REFRESH_SECRET=change-me-in-production-$(openssl rand -hex 32)
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123
ADMIN_EMAIL=admin@webowo.pl
CORS_ORIGIN=http://localhost:7777
SITE_URL=http://localhost:7777
UPLOAD_DIR=./data/uploads
BACKUP_DIR=./data/backups
LOG_DIR=./data/logs
EMAIL_ENABLED=false
EOF
    echo -e "${YELLOW}⚠ Utworzono .env z domyślnymi wartościami. Zmień hasła przed wdrożeniem!${NC}"
fi

echo ""
echo -e "${GREEN}✅ Instalacja zakończona!${NC}"
echo ""
echo -e "${BLUE}🚀 Uruchomienie:${NC}"
echo "   npm run dev:backend   # Backend (port 3000)"
echo "   npm run dev:frontend  # Frontend (port 7777)"
echo ""
echo -e "${BLUE}🐳 Docker:${NC}"
echo "   docker-compose up -d"
echo ""
echo -e "${BLUE}🔑 Domyślne dane logowania:${NC}"
echo "   Login: admin"
echo "   Hasło: admin123"
echo ""
echo -e "${YELLOW}⚠ Pamiętaj o zmianie domyślnych haseł przed wdrożeniem na produkcję!${NC}"
