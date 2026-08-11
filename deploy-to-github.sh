#!/bin/bash
# ============================================
# Webowo v3.0 – Deploy to GitHub
# ============================================

set -e

echo "🚀 Wdrażanie Webowo na GitHub..."

# Check git
if ! command -v git &> /dev/null; then
    echo "❌ Git nie jest zainstalowany"
    exit 1
fi

# Check repo
if [ ! -d .git ]; then
    echo "❌ To nie jest repozytorium git"
    exit 1
fi

echo "📦 Budowanie frontendu..."
cd frontend
npm run build
cd ..

echo "📤 Commit i push..."
git add -A
git commit -m "Webowo v3.0 – production build $(date +%Y-%m-%d)" || true
git push origin main

echo "✅ Wdrożenie zakończone!"
