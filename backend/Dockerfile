# ============================================
# Webowo v3.0 – Backend Dockerfile
# ============================================

FROM node:20-alpine

WORKDIR /app

# Install dependencies for sharp
RUN apk add --no-cache python3 make g++ vips-dev

COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

COPY . .

# Create data directories
RUN mkdir -p /app/data/db /app/data/uploads /app/data/backups /app/data/logs /app/data/gdpr

EXPOSE 3000

USER node

CMD ["node", "server.js"]
