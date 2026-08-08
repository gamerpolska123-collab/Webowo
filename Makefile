# ============================================
# Webowo v3.0 – Makefile
# ============================================

.PHONY: install dev build docker test lint clean

install:
	@echo "📦 Instalacja zależności..."
	cd backend && npm install
	cd frontend && npm install

dev-backend:
	cd backend && npm run dev

dev-frontend:
	cd frontend && npm run dev

dev:
	@echo "🚀 Uruchamianie backendu i frontendu..."
	make dev-backend & make dev-frontend

build:
	@echo "🔨 Budowanie frontendu..."
	cd frontend && npm run build

docker-build:
	@echo "🐳 Budowanie obrazów Docker..."
	docker-compose build

docker-up:
	@echo "🐳 Uruchamianie kontenerów..."
	docker-compose up -d

docker-down:
	@echo "🛑 Zatrzymywanie kontenerów..."
	docker-compose down

docker-logs:
	docker-compose logs -f

test:
	@echo "🧪 Uruchamianie testów..."
	cd backend && npm test
	cd frontend && npm test

lint:
	@echo "🔍 Sprawdzanie kodu..."
	cd backend && npm run lint
	cd frontend && npm run lint

clean:
	@echo "🧹 Czyszczenie..."
	./cleanup.sh

backup:
	@echo "💾 Tworzenie kopii zapasowej..."
	cd backend && npm run backup

update:
	@echo "⬆️ Aktualizacja zależności..."
	cd backend && npm update
	cd frontend && npm update
