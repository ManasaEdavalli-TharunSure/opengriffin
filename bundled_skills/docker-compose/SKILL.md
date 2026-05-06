---
name: docker-compose
description: Use when the user wants to set up or modify a docker-compose.yml for a multi-service local dev stack.
license: Apache-2.0
author: OpenGriffin
---

# docker-compose

`docker-compose.yml` defines a multi-service stack. Modern Docker Compose uses `docker compose` (no hyphen).

## Minimal stack

```yaml
services:
  app:
    build: .
    ports: ["8000:8000"]
    environment:
      DATABASE_URL: postgres://user:pass@db:5432/app
    depends_on:
      db:
        condition: service_healthy

  db:
    image: postgres:16-alpine
    environment:
      POSTGRES_USER: user
      POSTGRES_PASSWORD: pass
      POSTGRES_DB: app
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d app"]
      interval: 2s
      timeout: 5s
      retries: 10

volumes:
  pgdata:
```

## Common operations

- `docker compose up -d` — start all in background.
- `docker compose logs -f app` — tail one service.
- `docker compose exec app bash` — shell into running container.
- `docker compose down -v` — stop + remove volumes (data loss).
- `docker compose build --no-cache` — force rebuild.

## Override for dev

`docker-compose.override.yml` is auto-loaded. Use for hot-reload mounts:

```yaml
services:
  app:
    volumes: [".:/app"]
    command: ["python", "-m", "uvicorn", "app.main:app", "--reload"]
```

## Anti-patterns

- Hard-coding secrets in `environment:` — use `env_file:` or Docker secrets.
- No `depends_on: condition: service_healthy` — the app starts before the DB is ready.
- `restart: always` on dev stacks — masks crashes you should see.
