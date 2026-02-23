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


# CSS Architecture — Category-Scoped Styling

## Overview

All markdown pages draw from a single stylesheet: `src/components/MarkdownPage/markdown.css`.
Styling is layered via a two-class system applied to the wrapper div in `MarkdownPage.jsx`.

## How It Works

```jsx
<div className={`markdown-body ${category ? `markdown-${category}` : ''}`}>
```

The `category` value is read from each page's front-matter and passed down through:

```
docs.js (front-matter parser)
  → DocPage.jsx (passes category prop)
    → MarkdownPage.jsx (applies modifier class)
      → markdown.css (base + category rules)
```

## Class Layers

Every page receives the base class unconditionally. The category modifier stacks on top.

| Front-matter category | Classes applied |
|---|---|
| `sdk` | `markdown-body markdown-sdk` |
| `endpoints` | `markdown-body markdown-endpoints` |
| `infrastructure` | `markdown-body markdown-infrastructure` |
| `architecture` | `markdown-body markdown-architecture` |
| *(none set)* | `markdown-body` |

## Category Overrides

```css
/* Base — all pages */
.markdown-body           { max-width: 960px; ... }

/* Architecture — wide diagrams */
.markdown-architecture   { max-width: 1200px; }

/* SDK — dense code, tight column */
.markdown-sdk            { max-width: 860px; }

/* Endpoints — parameter tables */
.markdown-endpoints      { max-width: 1080px; }

/* Infrastructure — long guides */
.markdown-infrastructure h2 { border-bottom: 1px solid #e5e7eb; }
```

Category rules only override what they explicitly declare.
Everything else falls through to the base `.markdown-body` styles unchanged.

## Adding a New Category

1. Add the category key to `categoryDisplayNames` in `docs.js` and `DocsSidebar.jsx`
2. Add front-matter `category: your-category` to the relevant `.md` files
3. Optionally add a `.markdown-your-category { }` block to `markdown.css`

No other files need to change.

## File Locations

| File | Role |
|---|---|
| `src/components/MarkdownPage/markdown.css` | Single source of all markdown styles |
| `src/components/MarkdownPage/MarkdownPage.jsx` | Applies the two-class pattern |
| `src/pages/common/DocPage.jsx` | Reads front-matter, passes `category` prop |
| `src/lib/docs.js` | Parses front-matter, exposes `pages` map |
