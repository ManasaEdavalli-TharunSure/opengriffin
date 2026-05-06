---
name: linear-task
description: Use when the user wants to create or query Linear issues via the Linear API.
license: Apache-2.0
author: OpenGriffin
---

# Linear via API

Linear's GraphQL API is at `https://api.linear.app/graphql`. Auth via `Authorization: <api_key>` header.

## Create an issue

```bash
curl -X POST https://api.linear.app/graphql \
  -H "Authorization: $LINEAR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"query":"mutation { issueCreate(input: { teamId: \"TEAM_ID\", title: \"Fix X\", description: \"...\" }) { success issue { id identifier } } }"}'
```

Get team IDs once and cache them:
```bash
curl ... -d '{"query":"{ teams { nodes { id name key } } }"}'
```

## Query issues

```graphql
query {
  issues(filter: { state: { name: { eq: "Todo" } } }, first: 50) {
    nodes { identifier title state { name } assignee { name } }
  }
}
```

## Tips

- Set `priority` (1=urgent through 4=low) when creating.
- Use `labelIds` to tag.
- `parentId` makes a sub-task.
