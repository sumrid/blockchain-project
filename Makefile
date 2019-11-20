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

start:
	@echo "Starting project..."
	docker-compose up

sync:
	@echo "Sync user from firebase..."