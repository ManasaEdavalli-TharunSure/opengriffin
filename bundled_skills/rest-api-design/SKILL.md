---
name: rest-api-design
description: Use when the user is designing a REST API — covers naming, status codes, pagination, errors, versioning.
license: Apache-2.0
author: OpenGriffin
---

# REST API design

## Resource naming

- Plural nouns for collections: `/users`, `/orders`.
- Singular for individual items via id: `/users/42`.
- Sub-resources with hierarchy: `/users/42/orders`.
- Avoid verbs in URLs (`/users/42/activate` → `POST /users/42/activations`).
- Use `kebab-case`, not `snake_case`, in path segments.

## HTTP methods

| Method | Idempotent? | Use for |
|---|---|---|
| GET | ✅ | read |
| POST | ❌ | create / non-idempotent action |
| PUT | ✅ | full replace |
| PATCH | ❌ | partial update |
| DELETE | ✅ | remove |

## Status codes

- `200` OK — success with response body
- `201` Created — POST that created a resource (include `Location:` header)
- `204` No Content — success, no body (DELETE)
- `400` Bad Request — client malformed request
- `401` Unauthorized — no/invalid auth
- `403` Forbidden — authenticated but not allowed
- `404` Not Found — resource doesn't exist
- `409` Conflict — version mismatch / duplicate
- `422` Unprocessable Entity — semantically invalid (validation)
- `429` Too Many Requests — rate limited
- `500/502/503` — server errors

Don't return `200 {error: ...}` — clients can't tell success from failure.

## Pagination

Cursor-based is best for streams:
```json
{
  "data": [...],
  "next_cursor": "eyJpZCI6MTAwMH0="
}
```

Offset-based for lists with stable sort:
```
GET /orders?limit=50&offset=100
```

## Error shape

Pick ONE shape and use it everywhere:

```json
{
  "error": {
    "code": "VALIDATION_FAILED",
    "message": "email is required",
    "field": "email",
    "trace_id": "..."
  }
}
```

## Versioning

- URL path (`/v1/`) — explicit, easy.
- Header (`Accept: application/vnd.app.v1+json`) — clean URLs, harder to debug.
- Pick one. Don't mix.

## Anti-patterns

- `GET /users/delete/42` — mutating with GET is illegal in caches and middleboxes.
- Returning HTML on errors — clients expect JSON they can parse.
- Different shapes for the same resource on `GET` vs `POST` response.
- Skipping rate limits "until it's a problem" (it'll be a problem at 3am).
