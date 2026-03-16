.PHONY: db-up db-push db-rollback dev

db-up:
	docker compose up -d

db-push:
	bunx drizzle-kit push

db-rollback:
	@LATEST=$$(ls -1 drizzle/*.rollback.sql 2>/dev/null | sort | tail -n 1); \
	if [ -z "$$LATEST" ]; then echo "No rollback files found"; exit 1; fi; \
	echo "Running rollback: $$LATEST"; \
	PGPASSWORD=firstuser psql -h localhost -U firstuser -d authdb -f "$$LATEST"

dev:
	bun run src/index.ts
