---
name: notion-page
description: Use when the user wants to read, create, or update Notion pages and databases via the Notion API.
license: Apache-2.0
author: OpenGriffin
---

# Notion via API

Endpoint: `https://api.notion.com/v1`. Header: `Notion-Version: 2022-06-28`.

## Create a page in a database

```bash
curl -X POST https://api.notion.com/v1/pages \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -d '{
    "parent": { "database_id": "DB_ID" },
    "properties": {
      "Name": { "title": [{ "text": { "content": "Title" } }] },
      "Status": { "select": { "name": "Todo" } }
    }
  }'
```

## Append blocks to a page

```bash
curl -X PATCH https://api.notion.com/v1/blocks/PAGE_ID/children \
  -H "Authorization: Bearer $NOTION_TOKEN" \
  -H "Notion-Version: 2022-06-28" \
  -d '{ "children": [
    { "object": "block", "type": "paragraph",
      "paragraph": { "rich_text": [{ "type": "text", "text": { "content": "..." } }] } }
  ] }'
```

## Common pitfalls

- Database IDs are 32-char UUIDs. Strip dashes; they work either way.
- Property names are CASE-SENSITIVE.
- The integration must be SHARED with the page/database — Notion's permission model is opt-in per-resource.
