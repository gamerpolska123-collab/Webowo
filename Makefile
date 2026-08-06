.PHONY: install dev build test backup deploy clean

install:
	cd backend && npm install
	cd frontend && npm install

dev:
	cd backend && npm run dev &
	cd frontend && npm run dev

build:
	cd frontend && npm run build

test:
	cd backend && npm test
	cd frontend && npm test

backup:
	cd backend && npm run backup

deploy:
	docker-compose up -d --build

clean:
	docker-compose down -v
	find . -name 'node_modules' -type d -prune -exec rm -rf {} +
	find . -name 'dist' -type d -prune -exec rm -rf {} +
