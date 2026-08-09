# ============================================
# Webowo v3.0 – Backend Dockerfile
# Using Debian-based image for better native module compatibility
# (better-sqlite3 and sharp have issues with Alpine/musl libc)
# ============================================

FROM node:20-slim

WORKDIR /app

# Install build dependencies for native modules (better-sqlite3, sharp)
RUN apt-get update && apt-get install -y     python3     make     g++     libvips-dev     && rm -rf /var/lib/apt/lists/*

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

# Create data directories
RUN mkdir -p /app/data/db /app/data/uploads /app/data/backups /app/data/logs /app/data/gdpr

EXPOSE 3000

CMD ["node", "server.js"]
