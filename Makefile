install:
	@echo "Installing dependencies..."
	@(cd api/api_v2 && npm i)
	@(cd api/socket-io && npm i)
	@(cd api/revenue-api && npm i)
	@(cd client-app && npm i)
	@(cd dashboard-ui && npm i)
	@(cd store && npm i)

build:
	@echo "Building web..."
	@(cd client-app && npm run build)
	@(cd dashboard-ui && npm run build)
	@(cd store && npm run build)

register:
	@echo "Register admin and user..."
	@(cd api/api_v2 && npm run regis-admin)
	@(cd api/api_v2 && npm run regis-user)
	@(cd api/api_v2 && npm run sync)

start:
	@echo "Starting project..."
	docker-compose up

sync:
	@echo "Sync user from firebase..."