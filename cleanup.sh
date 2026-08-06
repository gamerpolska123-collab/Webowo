#!/bin/bash
# ============================================
# Webowo v2.0 – Cleanup Script
# ============================================

echo "🧹 Cleaning up..."

# Remove node_modules
find . -name 'node_modules' -type d -prune -exec rm -rf {} + 2>/dev/null || true

# Remove dist
find . -name 'dist' -type d -prune -exec rm -rf {} + 2>/dev/null || true

# Remove Docker volumes
docker-compose down -v 2>/dev/null || true

echo "✅ Cleanup complete"
