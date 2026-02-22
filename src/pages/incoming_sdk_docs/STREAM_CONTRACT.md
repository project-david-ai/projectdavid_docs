# Event Contract — Streaming Protocol

This document defines the event types emitted by the platform over the streaming
response channel. It is the authoritative reference for SDK consumers and frontend
integrators. Both sides — backend emitter and frontend consumer — are bound by the
shapes described here.

---

## Transport

Events are delivered as a **newline-delimited JSON stream** (NDJSON). Each line is
a self-contained JSON object. Consumers must parse line-by-line and must tolerate
blank lines, which should be skipped silently.

Some clients may receive pre-parsed objects directly (e.g. via the SDK's async
iterator). In that case the line-splitting and JSON parsing step is handled by
the SDK and consumers receive plain objects.

---

## Envelope

Every event has at minimum:

```json
{
  "type": "<event_type>",
  "run_id": "<uuid>"
}
```

| Field    | Type   | Required | Description                                 |
|----------|--------|----------|---------------------------------------------|
| `type`   | string | yes      | Discriminator field. See event types below. |
| `run_id` | string | yes      | Identifies the active inference run.        |

All other fields are type-specific and documented per event below.

---

## Event Types

### `content`

A chunk of assistant response text. Consumers should concatenate these in order
to build the final message.

```json
{
  "type": "content",
  "run_id": "abc123",
  "content": "Here is the answer to your question..."
}
```

| Field     | Type   | Description                 |
|-----------|--------|-----------------------------|
| `content` | string | Partial or full text chunk. |

> **Note:** Some `content` events carry internal status labels from backend mixins
> (e.g. `"📖 Reading scratchpad..."`). These are implementation bleed and must
> be filtered by the consumer. See [Scratchpad Bleed Filter](#scratchpad-bleed-filter).

---

### `reasoning`

Internal chain-of-thought text produced before the final response. Consumers may
display this in a collapsed/secondary UI element.

```json
{
  "type": "reasoning",
  "run_id": "abc123",
  "content": "The user is asking about..."
}
```

| Field     | Type   | Description           |
|-----------|--------|-----------------------|
| `content` | string | Reasoning text chunk. |

---

### `web_status`

A lifecycle or progress event scoped to web tool execution. Used exclusively to
drive the WebSearchStatus UI component.

**Source:** `WebSearchMixin._status()`
**SDK event class:** `WebStatusEvent`

```json
{
  "type": "web_status",
  "run_id": "abc123",
  "status": "running",
  "tool": "perform_web_search",
  "message": "Querying search engine: 'NVIDIA FY2024 revenue'..."
}
```

| Field     | Type   | Required | Description                                          |
|-----------|--------|----------|------------------------------------------------------|
| `status`  | string | yes      | See [Status Values](#status-values).                 |
| `tool`    | string | yes      | Name of the web tool emitting this event.            |
| `message` | string | yes      | Human-readable description of the current operation. |

**Contract rule:** `web_status` events use `status` + `message` exclusively.
The fields `state` and `activity` belong to `research_status` and must never
appear here.

**Web tool names** (used for routing `tool_call_start` events):

| Tool name            | Routes to       |
|----------------------|-----------------|
| `perform_web_search` | WebSearchStatus |
| `read_web_page`      | WebSearchStatus |
| `scroll_web_page`    | WebSearchStatus |
| `search_web_page`    | WebSearchStatus |
| `web_search`         | WebSearchStatus |
| `browse`             | WebSearchStatus |

---

### `research_status`

A higher-level orchestration event describing delegation and agent activity.
Used exclusively to drive the DeepResearchStatus UI component.

**Source:** `DelegationMixin._research_status()` and `ToolCallRequestEvent`
success block (non-web, non-delegation tools).
**SDK event class:** `ResearchStatusEvent`

```json
{
  "type": "research_status",
  "run_id": "abc123",
  "tool": "delegate_research_task",
  "state": "in_progress",
  "activity": "Worker active. Streaming..."
}
```

| Field      | Type   | Required | Description                                         |
|------------|--------|----------|-----------------------------------------------------|
| `tool`     | string | yes      | Name of the tool or agent component.                |
| `state`    | string | yes      | See [Status Values](#status-values).                |
| `activity` | string | yes      | Human-readable description of the current activity. |

**Contract rule:** `research_status` events use `state` + `activity` exclusively.
The fields `status` and `message` belong to `web_status` and must never
appear here.

**Delegation tool names** (these emit their own terminal `research_status` event
internally — the backend consumer must not emit a second one on tool success):

| Tool name                | Behaviour                             |
|--------------------------|---------------------------------------|
| `delegate_research_task` | Self-managing — skip success emission |

---

### `scratchpad_status`

An update to the agent's internal scratchpad / working memory. Consumers must
route these exclusively to the ScratchpadStatus UI component — never to the
chat bubble or any other status component.

**Source:** `ScratchpadMixin._scratchpad_status()`
**SDK event class:** `ScratchpadEvent`

```json
{
  "type": "scratchpad_status",
  "run_id": "abc123",
  "operation": "append",
  "state": "success",
  "tool": "append_scratchpad",
  "activity": "📝 Scratchpad entry written.",
  "entry": "✅ NVIDIA | Net Revenue | $60,922M | source: SEC 10-K FY2024"
}
```

| Field       | Type   | Required | Description                                              |
|-------------|--------|----------|----------------------------------------------------------|
| `operation` | string | yes      | One of `read`, `append`, `update`.                       |
| `state`     | string | yes      | See [Status Values](#status-values).                     |
| `tool`      | string | no       | The scratchpad tool that triggered the event.            |
| `activity`  | string | no       | Short human-readable status label.                       |
| `entry`     | string | no       | Full scratchpad entry text. Present on `state: success`. |

**Lifecycle sequence** for a single scratchpad operation:

1. `state: "in_progress"` — operation has started, `activity` is set, `entry` is null.
2. `state: "success"` — operation completed, `entry` contains the written/read content, `tool` and `activity` are null.
3. `state: "completed"` — terminal confirmation, `activity` is the done label, `entry` is null.

**Scratchpad tool names** (used to silently swallow `tool_call_start` events —
ScratchpadStatus handles its own display):

| Tool name          |
|--------------------|
| `scratchpad`       |
| `read_scratchpad`  |
| `write_scratchpad` |
| `append_scratchpad`|
| `update_scratchpad`|

#### Strategy Entry Prefixes

Scratchpad entries always begin with one of these emoji, which consumers use as a
secondary detection signal when entries arrive embedded in `content` events:

| Prefix | Meaning            |
|--------|--------------------|
| `📌`   | New strategy entry |
| `✅`   | Completed step     |
| `🔄`   | Revised strategy   |
| `❓`   | Open question      |
| `⚠️`  | Warning / issue    |
| `☠️`  | Dead end / abort   |

---

### `tool_call_start` / `tool_call_manifest`

Emitted when a tool invocation begins. Consumers use this to show a tool-in-progress
indicator before results arrive.

```json
{
  "type": "tool_call_start",
  "run_id": "abc123",
  "tool": "read_web_page",
  "args": {}
}
```

| Field  | Type   | Description                     |
|--------|--------|---------------------------------|
| `tool` | string | Name of the tool being invoked. |
| `args` | object | Arguments passed to the tool.   |

**Routing rules:**

| Tool category    | Route to                        |
|------------------|---------------------------------|
| Web tools        | WebSearchStatus (`in_progress`) |
| Scratchpad tools | Swallow silently                |
| All others       | DeepResearchStatus (`in_progress`) |

---

### `code_status`

Lifecycle events from the code execution sandbox. Routed to the DeepResearch
activity feed.

**SDK event class:** `CodeStatusEvent`

```json
{
  "type": "code_status",
  "run_id": "abc123",
  "tool": "code_interpreter",
  "state": "in_progress",
  "activity": "Executing Python script..."
}
```

| Field      | Type   | Description                                  |
|------------|--------|----------------------------------------------|
| `tool`     | string | Name of the code tool.                       |
| `state`    | string | See [Status Values](#status-values).         |
| `activity` | string | Human-readable description of the operation. |

---

### `status`

A stream-level lifecycle event. Used only to signal full run completion.
Not to be confused with `web_status` (web tool progress) or `research_status`
(orchestration activity).

```json
{
  "type": "status",
  "run_id": "abc123",
  "status": "complete"
}
```

| Field    | Type   | Description                              |
|----------|--------|------------------------------------------|
| `status` | string | `"complete"` or `"inference_complete"`.  |

On receipt of this event consumers must mark the message as no longer streaming
and flush any open scratchpad accumulation buffer.

---

### `error`

A terminal error event. The run cannot continue.

```json
{
  "type": "error",
  "run_id": "abc123",
  "error": "Tool execution timed out."
}
```

| Field   | Type   | Description                   |
|---------|--------|-------------------------------|
| `error` | string | Human-readable error message. |

---

### `generated_file` / `code_interpreter_file`

A file produced by the assistant during code execution or generation.

```json
{
  "type": "generated_file",
  "run_id": "abc123",
  "filename": "report.pdf",
  "mime_type": "application/pdf",
  "file_id": "file_xyz",
  "url": "https://...",
  "base64": "<optional base64 data>"
}
```

| Field       | Type   | Required | Description                              |
|-------------|--------|----------|------------------------------------------|
| `filename`  | string | yes      | Original filename.                       |
| `mime_type` | string | yes      | MIME type of the file.                   |
| `file_id`   | string | yes      | Stable identifier for deduplication.     |
| `url`       | string | no       | Download URL if available.               |
| `base64`    | string | no       | Base64-encoded file content if no URL.   |

---

### `hot_code`

A chunk of code being written by the code interpreter in real time.

```json
{
  "type": "hot_code",
  "run_id": "abc123",
  "content": "import pandas as pd\n"
}
```

---

### `hot_code_output` / `computer_output`

Output produced by executed code or a shell command.

```json
{
  "type": "hot_code_output",
  "run_id": "abc123",
  "content": "   name  value\n0  foo   1\n"
}
```

---

## Status Values

Both `web_status` and `research_status` (and `scratchpad_status`) share this
normalization table. Consumers must normalize before display.

| Backend value        | Normalized UI value | Meaning                      |
|----------------------|---------------------|------------------------------|
| `started`            | `in_progress`       | Operation has begun.         |
| `running`            | `in_progress`       | Operation is ongoing.        |
| `in_progress`        | `in_progress`       | Operation is ongoing.        |
| `complete`           | `success`           | Operation finished cleanly.  |
| `completed`          | `success`           | Operation finished cleanly.  |
| `done`               | `success`           | Operation finished cleanly.  |
| `success`            | `success`           | Operation finished cleanly.  |
| `inference_complete` | `success`           | Full run is complete.        |
| `failed`             | `error`             | Operation failed.            |
| `error`              | `error`             | Operation failed.            |
| `warning`            | `warning`           | Non-fatal issue, continuing. |

---

## Field Ownership — Cross-Contamination Rules

These fields are owned exclusively by one event type. Consumers must never read
a field from the wrong event type, and emitters must never include a field in
the wrong event shape.

| Field       | Owned by                                | Never appears in                        |
|-------------|------------------------------------------|-----------------------------------------|
| `status`    | `web_status`                             | `research_status`, `scratchpad_status`  |
| `message`   | `web_status`                             | `research_status`, `scratchpad_status`  |
| `state`     | `research_status`, `scratchpad_status`   | `web_status`                            |
| `activity`  | `research_status`, `scratchpad_status`   | `web_status`                            |
| `entry`     | `scratchpad_status`                      | all others                              |
| `operation` | `scratchpad_status`                      | all others                              |

---

## Scratchpad Bleed Filter

The backend occasionally emits scratchpad operation status labels as `type:'content'`
events. These are implementation artifacts and must be swallowed by consumers —
they must never appear in the chat bubble or any status component.

The following strings must be filtered if encountered in a `content` event:

```
📖 Reading scratchpad...
📖 Scratchpad read.
✏️ Updating scratchpad...
✏️ Scratchpad updated.
📝 Appending to scratchpad...
📝 Scratchpad entry written.
Accessing memory...
Memory synchronized.
Scratchpad error:
Validation error:
```

> **Important:** Apply this filter *after* checking for scratchpad entry prefixes
> (`📌 ✅ 🔄 ❓ ⚠️ ☠️`). Legitimate scratchpad entries that happen to contain
> bleed strings must not be swallowed.

---

## Consumer Routing Order

### `content` events

When a `type:'content'` event arrives, consumers must evaluate in this exact order:

1. **Scratchpad entry start?** — does the text begin with `📌 ✅ 🔄 ❓ ⚠️ ☠️`?
   → open scratchpad accumulation buffer, `return`
2. **Mid scratchpad block?** — is an accumulation currently open?
   → append to buffer, `return`
3. **Legacy StatusEvent string?** — does the text start with `StatusEvent(`?
   → parse and route to WebSearchStatus, `return`
4. **Bleed string?** — does the text match the filter list above?
   → swallow silently, `return`
5. **Default** → render as chat content

### `tool_call_start` events

1. Tool name in web tool set → WebSearchStatus (`in_progress`)
2. Tool name in scratchpad tool set → swallow silently
3. Anything else → DeepResearchStatus (`in_progress`)

### `web_status` events

1. Tool name in web tool set → WebSearchStatus, read `status` + `message`
2. Tool name in scratchpad tool set → swallow silently
3. Anything else → DeepResearchStatus (defensive fallback only; must not occur
   after backend fix)

### `research_status` events

1. Tool name in scratchpad tool set → forward to ScratchpadStatus only if
   `state` is terminal and `data` is present
2. Tool name in web tool set → WebSearchStatus (defensive fallback only; must not
   occur after backend fix), read `state` as status, `activity` as message
3. Anything else → DeepResearchStatus, read `state` + `activity`

---

## Web Tool Scroll Contract

The backend enforces the following constraints on `scroll_web_page` to prevent
unbounded scroll loops:

- **Search-first gate:** `scroll_web_page` on any page beyond page 0 is blocked
  until `search_web_page` has been called on the same URL in the current session.
- **Hard scroll limit:** A maximum of **3** `scroll_web_page` calls are permitted
  per URL per run. Calls beyond this limit return a blocking instruction rather
  than page content.

When either constraint is violated the tool returns a `type:'content'` event
containing a `🛑` prefixed error message with recovery instructions. Consumers
should display this as normal assistant content.

---

## Deprecated Types

The following type strings were used in earlier versions and are now retired.
Consumers must not handle them. Emitters must not produce them.

| Deprecated type | Replaced by        | Reason                                               |
|-----------------|--------------------|------------------------------------------------------|
| `activity`      | `research_status`  | Renamed for clarity and contract enforcement.        |
| `status`        | `web_status`       | `status` is now reserved for stream lifecycle only.  |
| `scratchpad`    | `scratchpad_status`| Renamed for consistency with other type names.       |

---

## Versioning

This contract is currently **unversioned**. Breaking changes will be noted in the
SDK changelog. A `version` field may be added to the envelope in a future release.