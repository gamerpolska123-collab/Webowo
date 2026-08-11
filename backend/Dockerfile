# ============================================
# Webowo v3.1 – Backend Dockerfile
# ============================================

FROM node:20-alpine

WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

COPY package*.json ./
RUN npm ci --only=production

COPY . .

# Create data directories
RUN mkdir -p /app/data/db /app/data/uploads /app/data/backups /app/data/logs /app/data/gdpr

EXPOSE 3000

CMD ["node", "server.js"]
