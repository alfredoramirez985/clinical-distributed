postgres:
	docker compose up -d postgres

redis:
	docker compose up -d redis

db-push:
	bunx drizzle-kit push

db-rollback:
	@LATEST=$$(ls -1 drizzle/*.rollback.sql 2>/dev/null | sort | tail -n 1); \
	if [ -z "$$LATEST" ]; then echo "No rollback files found"; exit 1; fi; \
	echo "Running rollback: $$LATEST"; \
	PGPASSWORD=firstuser psql -h localhost -U firstuser -d doctorroomdb -p 5433 -f "$$LATEST"

dev:
	bun run src/index.ts

build:
	bun build --compile --minify --sourcemap ./src/index.ts --outfile clinical-main-doctor-room

check:
	bunx tsc --noEmit

clean:
	rm -f clinical-main-doctor-room index.js.map
