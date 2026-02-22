# Slug & Category Reference

## Category Keys

```js
const categoryDisplayNames = {
  'sdk'           : 'SDK',
  'endpoints'     : 'API ENDPOINTS',
  'infrastructure': 'INFRASTRUCTURE',
  'architecture'  : 'ARCHITECTURE',
};
```

## Slug Prefix Convention

| Category | Slug Prefix | Example |
|---|---|---|
| `sdk` | `sdk-` | `sdk-assistants` |
| `endpoints` | `api-` | `api-assistants` |
| `infrastructure` | `infra-` | `infra-quick-start` |
| `architecture` | `archi-` | `archi-assistant-cache` |

## Front-matter Templates

### SDK
```yaml
---
title: Assistants
category: sdk
slug: sdk-assistants
---
```

### Endpoints
```yaml
---
title: Assistants API
category: endpoints
layout: api
slug: api-assistants
---
```

### Infrastructure
```yaml
---
title: Quick Start
category: infrastructure
slug: infra-quick-start
---
```

### Architecture
```yaml
---
title: Assistant Cache
category: architecture
slug: archi-assistant-cache
---
```

## Notes

- The slug prefix is the collision guard in the flat `pages` map in `docs.js`.
- Every `.md` file promoted into the app must have at minimum `title`, `category`, and `slug`.
- Files not ready for promotion should carry `nav_exclude: true` to keep them out of the sidebar without deleting them.
- The `layout: api` key in endpoints front-matter triggers `ApiReferencePage` instead of `MarkdownPage` in `DocPage.jsx`.