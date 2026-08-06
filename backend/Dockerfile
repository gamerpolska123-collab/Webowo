# ============================================
# Webowo Backend – Dockerfile
# ============================================

FROM node:22-alpine

WORKDIR /app

# Install dependencies (npm install instead of npm ci - no package-lock.json)
COPY package*.json ./
RUN npm install --omit=dev

# Copy source
COPY . .

# Create data directories
RUN mkdir -p /app/data/db /app/data/backups /app/data/uploads /app/data/logs

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "server.js"]
