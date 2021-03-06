-include local/Makefile

MAKEFLAGS += -j2

.PHONY: all deps-server deps-dashboard depss run-server run-dashboard run run-docker test-dashboard tesst clean help

all: deps run

##@ Dependencies

deps-server: ## Install server dependencies.
	@echo "install server dependencies"
	@cd server; \
	yarn install --pure-lockfile --no-progress

deps-dashboard: ## Install dashboard dependencies.
	@echo "install frontend dependencies"
	@cd dashboard; \
	yarn install --pure-lockfile --no-progress

deps: deps-server deps-dashboard ## Install all dependencies.

##@ Running

run-server: ## Run the node server
	@echo "run the server"
	@cd server; \
	yarn start

run-dashboard: ## Run the React dashboard
	@echo "run the dashboard"
	@cd dashboard; \
	yarn start

run: run-server run-dashboard ## Run the server and the dashboard

run-docker: ## Run the server and the dashboard in Docker
	@echo "run the server and the dashboard in Docker"
	docker-compose up

##@ Testing

test-dashboard: ## Run tests for dashboard.
	@echo "test dashboard"
	@cd dashboard; \
	yarn test

test: test-dashboard ## Run all tests.

clean: ## Clean up intermediate build artifacts.
	@echo "cleaning"
	rm -rf dashboard/node_modules
	rm -rf server/node_modules

help: ## Display this help.
	@awk 'BEGIN {FS = ":.*##"; printf "\nUsage:\n  make \033[36m<target>\033[0m\n"} /^[a-zA-Z_-]+:.*?##/ { printf "  \033[36m%-15s\033[0m %s\n", $$1, $$2 } /^##@/ { printf "\n\033[1m%s\033[0m\n", substr($$0, 5) } ' $(MAKEFILE_LIST)
