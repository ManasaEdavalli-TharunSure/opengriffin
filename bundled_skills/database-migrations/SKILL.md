---
name: database-migrations
description: Use when the user is writing or reviewing a SQL schema migration — covers safe patterns and deployment strategy.
license: Apache-2.0
author: OpenGriffin
---

# Database migrations

## Tools

- **Postgres**: alembic (Python), atlas, sqitch
- **Generic**: flyway, liquibase
- **Frameworks**: Django migrations, Rails, Prisma

## Safe migration patterns

### Add a column
- ✅ `ADD COLUMN x ... NULL` — safe.
- ⚠️ `ADD COLUMN x ... NOT NULL DEFAULT 'foo'` — locks the table on big tables in older Postgres. Modern Postgres ≥11 handles instantly.
- ❌ `ADD COLUMN x ... NOT NULL` (no default) — fails if rows exist.

### Drop a column
- Two-phase: stop writing → wait → stop reading → wait → drop. Don't drop in one PR.

### Rename a column
- Don't. Add new, dual-write, migrate readers, then drop old.

### Add an index
- `CREATE INDEX CONCURRENTLY` (Postgres) — avoids locking writes.
- Schedule for off-hours; even concurrent index creation is I/O-heavy.

### Foreign keys
- `NOT VALID` first, then `VALIDATE` separately to avoid table-rewrite locks.

## Deployment order

```
1. Deploy code that writes to BOTH old and new schema.
2. Run migration to populate new schema from old.
3. Deploy code that READS from new schema (still writes both).
4. Verify everything reads from new.
5. Deploy code that drops old-schema writes.
6. Run migration to drop old-schema columns/tables.
```

Each step ships independently. You can roll back any one.

## Backfills

For large tables: batch in chunks of 1000–10000 rows with `WHERE id BETWEEN ...`. Sleep 100ms between batches.

## Anti-patterns

- Combining schema and data migrations in one transaction (you can't roll back partial work).
- Migrations that depend on application code being deployed first.
- "We'll just run it manually in prod" — every migration goes through CI / migration runner.
- Skipping a dry-run on a staging DB with prod-sized data.
