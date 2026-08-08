#!/bin/bash
# ============================================
# Webowo v3.0 – Cleanup Script
# ============================================

echo "🧹 Czyszczenie projektu Webowo..."

# Remove node_modules
rm -rf backend/node_modules frontend/node_modules

# Remove build artifacts
rm -rf frontend/dist
rm -rf backend/data/logs/* backend/data/backups/*

# Remove lock files (optional)
# rm backend/package-lock.json frontend/package-lock.json

echo "✅ Wyczyszczono. Uruchom ./install.sh, aby ponownie zainstalować."
