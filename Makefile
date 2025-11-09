.PHONY: help build build-dev up up-dev down down-dev logs logs-dev restart restart-dev clean clean-all migrate seed shell shell-dev

# Default target
help:
	@echo "Gemilike Website - Docker Commands"
	@echo ""
	@echo "Production Commands:"
	@echo "  make build          - Build production Docker image"
	@echo "  make up              - Start production containers"
	@echo "  make down            - Stop production containers"
	@echo "  make restart        - Restart production containers"
	@echo "  make logs            - Show production logs"
	@echo "  make shell           - Open shell in production app container"
	@echo ""
	@echo "Development Commands:"
	@echo "  make build-dev       - Build development Docker image"
	@echo "  make up-dev          - Start development containers"
	@echo "  make down-dev        - Stop development containers"
	@echo "  make restart-dev     - Restart development containers"
	@echo "  make logs-dev        - Show development logs"
	@echo "  make shell-dev       - Open shell in development app container"
	@echo ""
	@echo "Database Commands:"
	@echo "  make migrate         - Run database migrations (production)"
	@echo "  make migrate-dev     - Run database migrations (development)"
	@echo "  make seed            - Seed database (production)"
	@echo "  make seed-dev        - Seed database (development)"
	@echo ""
	@echo "Maintenance Commands:"
	@echo "  make clean           - Remove containers and volumes (production)"
	@echo "  make clean-all       - Remove all containers, volumes, and images"
	@echo "  make rebuild         - Rebuild production image without cache"
	@echo "  make rebuild-dev     - Rebuild development image without cache"

# Production Commands
build:
	docker-compose build

up:
	docker-compose up -d

down:
	docker-compose down

restart: down up

logs:
	docker-compose logs -f app

shell:
	docker-compose exec app sh

# Development Commands
build-dev:
	docker-compose -f docker-compose.dev.yml build

up-dev:
	docker-compose -f docker-compose.dev.yml up -d

down-dev:
	docker-compose -f docker-compose.dev.yml down

restart-dev: down-dev up-dev

logs-dev:
	docker-compose -f docker-compose.dev.yml logs -f app

shell-dev:
	docker-compose -f docker-compose.dev.yml exec app sh

# Database Commands
migrate:
	docker-compose exec app npx prisma migrate deploy

migrate-dev:
	docker-compose -f docker-compose.dev.yml exec app npx prisma migrate deploy

seed:
	docker-compose exec app npm run seed

seed-dev:
	docker-compose -f docker-compose.dev.yml exec app npm run seed

# Maintenance Commands
clean:
	docker-compose down -v

clean-all:
	docker-compose down -v --rmi all
	docker-compose -f docker-compose.dev.yml down -v --rmi all
	docker system prune -af --volumes

rebuild:
	docker-compose build --no-cache

rebuild-dev:
	docker-compose -f docker-compose.dev.yml build --no-cache

