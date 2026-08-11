#!/bin/bash
# ============================================
# Webowo v3.0 – Update Script
# ============================================
set -e  # Exit on any error

echo "[1/8] Stopping containers..."
cd ~/web3/Webowo-v3/Webowo
docker compose down

echo "[2/8] Removing old images..."
docker rmi webowo-backend webowo-frontend 2>/dev/null || true

echo "[3/8] Cleaning old files..."
cd ~/web3/Webowo-v3
if [ -d "Webowo" ]; then
    rm -rf Webowo
    echo "  Old Webowo/ removed"
fi

echo "[4/8] Extracting ZIP..."
ZIP_FILE=$(ls -t *.zip 2>/dev/null | head -n1)
if [ -z "$ZIP_FILE" ]; then
    echo "ERROR: No ZIP file found in ~/web3/Webowo-v3/"
    exit 1
fi
echo "  Found: $ZIP_FILE"
unzip -q "$ZIP_FILE"
if [ ! -d "Webowo" ]; then
    echo "ERROR: ZIP extraction failed"
    exit 1
fi

echo "[5/8] Removing ZIP..."
rm "$ZIP_FILE"

echo "[6/8] Checking .env..."
cd Webowo
if [ ! -f ".env" ]; then
    echo "  Creating .env from .env.example"
    cp .env.example .env
fi

echo "[7/8] Building and starting..."
docker compose up --build -d

echo "[8/8] Done! Showing logs (Ctrl+C to exit)..."
sleep 2
docker logs -f webowo-backend
