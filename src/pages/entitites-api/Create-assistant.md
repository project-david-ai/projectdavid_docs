---
layout: api
title: Assistants
---

Build an assistant with access to tools to perform tasks.

### Request body

| Name             | Type / Default                             | Description                                                                                                                                                                                                                                                                                                                                       |
|------------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`id`**         | `string`                                   | Unique assistant identifier (`"asst_5X2dIbKJsm8IgQTOAvK5WI"`).                                                                                                                                                                                                                                                                                    |
| `user_id`        | `string` \| `null`                         | ID of the user who owns the assistant. `null` if not yet associated.                                                                                                                                                                                                                                                                              |
| `object`         | `string` *(always `"assistant"`)*          | Object type discriminator.                                                                                                                                                                                                                                                                                                                        |
| `created_at`     | `integer` (Unix-epoch)                     | Creation timestamp in seconds (`1751169829`).                                                                                                                                                                                                                                                                                                     |
| `name`           | `string` ≤ 128 \| `null`                   | Assistant display name.                                                                                                                                                                                                                                                                                                                           |
| `description`    | `string` ≤ 256 \| `null`                   | Optional description of the assistant.                                                                                                                                                                                                                                                                                                            |
| **`model`**      | `string`                                   | ID of the default model the assistant will use. You can use the view supported models here.                                                                                                                                                                                                                                                       |
| `instructions`   | `string` \| `null`                         | System prompt that guides the assistant’s behaviour.                                                                                                                                                                                                                                                                                              |
| `tools`          | `array<object>` \| `null`                  | A list of tool enabled on the assistant.  These tools are maintained by the platform. Tools can be types  `code_interpreter`, `computer`, `file_search`,  or `web_search`.                                                                                                                                                                                                                                                                            |
| `tool_resources` | `object` \| `null`                         | Per-tool resource map keyed by tool type. Example:<br>`{"file_search":{"vector_store_ids":["vs_docs"]}}`                                                                                                                                                                                                                                          |
| `meta_data`      | `object` \| `null`                         | A set of value pairs that can be attached to your assistant object. This is useful for storing additional arbitrary information about the assistant in a  structured format. These values can be used in queries via the API.Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters. |
| `top_p`          | `number` 0–1 *(default 1.0)*               | Nucleus-sampling parameter. The model considers the top n% tokens when making its probabilistic determination. So 0.1 means that the top 10% will be considered. Use this or temperature to affect the models creativity, but not both. Some models may not support this parameter; in which any setting will be substituted with temperature.                                                                                                                                                                                                                                                                                                                     |
| `temperature`    | `number` 0–2 *(default 1.0)*               | Sampling temperature (creativity). Aim for a temperature setting between 0 and 2. Higher values result in more random output, lower values make the model more deterministic.                                                                                                                                                                                                                                                                                                              |
| `response_format`| `string` *(default `"auto"`)*              | Output format hint (`"auto"`, `"json"`, `"html"` …).                                                                                                                                                                                                                                                                                              |
| `vector_stores`  | `array<object>`                            | Vector stores attached to this assistant. Empty array if none.                                                                                                                                                                                                                                                                                    |
| `webhook_url`    | `https URL` \| `null`                      | Endpoint that receives `run.action_required` callbacks.                                                                                                                                                                                                                                                                                           |


```python
import os

from projectdavid import Entity

client = Entity()

assistant = client.assistants.create_assistant(
    name="Mathy",
    description="test_case",
    model='llama3.1',
    instructions="You are a helpful math tutor.",
    tools=[{"type": "code_interpreter"},
                   ],

)

print(f"{assistant}")
```

**Returns**

```json

{"id":"asst_5X2dIbKJsm8IgQTOAvK5WI",
  "user_id":null,
  "object":"assistant",
  "created_at":1751169829,
  "name":"Mathy",
  "description":"test_case",
  "model":"llama3.1",
  "instructions":"You are a helpful math tutor.",
  "tools":[{"type":"code_interpreter"}],
  "platform_tools":null,
  "tool_resources":null,
  "meta_data":null,
  "top_p":1.0,
  "temperature":1.0,
  "response_format":"auto",
  "vector_stores":[],
  "webhook_url":null}
```



### List assistants

Returns a list of assistants by user ID.

```python
assistant_list = client.assistants.list()

print(assistant_list)
```



**Returns**

```json

[
  {
    "id": "asst_01HZZZZZZ1",
    "user_id": "user_xyz",
    "object": "assistant",
    "created_at": 1751170452,
    "name": "SearchBot",
    "description": "Assistant that searches company docs",
    "model": "gpt-4o-mini",
    "instructions": "Use the file search tool whenever a query involves internal docs.",
    "tools": null,
    "platform_tools": [
      {
        "type": "file_search",
        "vector_store_ids": ["vs_docs"]
      }
    ],
    "tool_resources": {
      "file_search": { "vector_store_ids": ["vs_docs"] }
    },
    "meta_data": { "department": "knowledge-base" },
    "top_p": 0.9,
    "temperature": 0.7,
    "response_format": "auto",
    "vector_stores": [],
    "webhook_url": null
  },

  {
    "id": "asst_01HZZZZZZ2",
    "user_id": "user_xyz",
    "object": "assistant",
    "created_at": 1751170488,
    "name": "CodeHelper",
    "description": "Runs Python snippets and explains results",
    "model": "llama3.1",
    "instructions": "Be concise and add inline comments to code when helpful.",
    "tools": [
      { "type": "code_interpreter" }
    ],
    "platform_tools": null,
    "tool_resources": null,
    "meta_data": null,
    "top_p": 1.0,
    "temperature": 0.3,
    "response_format": "auto",
    "vector_stores": [],
    "webhook_url": null
  }
]

```




### Retrieve assistant



| Name           | Type / Default      | Description                                                                                                                                                                                                                                                                                                                                       |
|----------------|---------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`assistant_id`**         | `string` / `Required` | Unique assistant identifier (`"asst_5X2dIbKJsm8IgQTOAvK5WI"`).                                                                                                                                                                                                                                                                                    |



```python
from projectdavid import Entity
client = Entity()

assistant = client.assistants.retrieve_assistant(assistant_id=assistant.id)
print(assistant.json())
```

**Returns**

The assistant object matching the specified ID.

```json

{"id":"asst_5X2dIbKJsm8IgQTOAvK5WI",
  "user_id":null,
  "object":"assistant",
  "created_at":1751169829,
  "name":"Mathy",
  "description":"test_case",
  "model":"llama3.1",
  "instructions":"You are a helpful math tutor.",
  "tools":[{"type":"code_interpreter"}],
  "platform_tools":null,
  "tool_resources":null,
  "meta_data":null,
  "top_p":1.0,
  "temperature":1.0,
  "response_format":"auto",
  "vector_stores":[],
  "webhook_url":null}
```


### Modify assistant

Modifies an assistant.


| Name             | Type / Default                             | Description                                                                                                                                                                                                                                                                                                                                       |
|------------------|--------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`id`**         | `string`                                   | Unique assistant identifier (`"asst_5X2dIbKJsm8IgQTOAvK5WI"`).                                                                                                                                                                                                                                                                                    |
| `user_id`        | `string` \| `null`                         | ID of the user who owns the assistant. `null` if not yet associated.                                                                                                                                                                                                                                                                              |
| `object`         | `string` *(always `"assistant"`)*          | Object type discriminator.                                                                                                                                                                                                                                                                                                                        |
| `created_at`     | `integer` (Unix-epoch)                     | Creation timestamp in seconds (`1751169829`).                                                                                                                                                                                                                                                                                                     |
| `name`           | `string` ≤ 128 \| `null`                   | Assistant display name.                                                                                                                                                                                                                                                                                                                           |
| `description`    | `string` ≤ 256 \| `null`                   | Optional description of the assistant.                                                                                                                                                                                                                                                                                                            |
| **`model`**      | `string`                                   | ID of the default model the assistant will use. You can use the view supported models here.                                                                                                                                                                                                                                                       |
| `instructions`   | `string` \| `null`                         | System prompt that guides the assistant’s behaviour.                                                                                                                                                                                                                                                                                              |
| `tools`          | `array<object>` \| `null`                  | A list of tool enabled on the assistant.  These tools are maintained by the platform. Tools can be types  `code_interpreter`, `computer`, `file_search`,  or `web_search`.                                                                                                                                                                                                                                                                            |
| `tool_resources` | `object` \| `null`                         | Per-tool resource map keyed by tool type. Example:<br>`{"file_search":{"vector_store_ids":["vs_docs"]}}`                                                                                                                                                                                                                                          |
| `meta_data`      | `object` \| `null`                         | A set of value pairs that can be attached to your assistant object. This is useful for storing additional arbitrary information about the assistant in a  structured format. These values can be used in queries via the API.Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters. |
| `top_p`          | `number` 0–1 *(default 1.0)*               | Nucleus-sampling parameter. The model considers the top n% tokens when making its probabilistic determination. So 0.1 means that the top 10% will be considered. Use this or temperature to affect the models creativity, but not both. Some models may not support this parameter; in which any setting will be substituted with temperature.                                                                                                                                                                                                                                                                                                                     |
| `temperature`    | `number` 0–2 *(default 1.0)*               | Sampling temperature (creativity). Aim for a temperature setting between 0 and 2. Higher values result in more random output, lower values make the model more deterministic.                                                                                                                                                                                                                                                                                                              |
| `response_format`| `string` *(default `"auto"`)*              | Output format hint (`"auto"`, `"json"`, `"html"` …).                                                                                                                                                                                                                                                                                              |
| `vector_stores`  | `array<object>`                            | Vector stores attached to this assistant. Empty array if none.                                                                                                                                                                                                                                                                                    |
| `webhook_url`    | `https URL` \| `null`                      | Endpoint that receives `run.action_required` callbacks.                                                                                                                                                                                                                                                                                           |



The `update_assistant` method updates only the fields you supply. Any parameters you omit are left 
unchanged, so existing values remain intact.

```python
from projectdavid import Entity
client = Entity()

modify_assistant = client.assistants.update_assistant(
    assistant_id=assistant.id,
    name="Mathy",
    description="test_case",
    model='llama3.1',
    instructions="You are now a web search bot",
    tools=[{"type": "web_search"},
                   ],

)
print(modify_assistant)
```
**Returns**

```json

{"id":"asst_5X2dIbKJsm8IgQTOAvK5WI",
  "user_id":null,
  "object":"assistant",
  "created_at":1751169829,
  "name":"Mathy",
  "description":"test_case",
  "model":"llama3.1",
  "instructions":"You are a helpful math tutor.",
  "tools":[{"type":"code_interpreter"}],
  "platform_tools":null,
  "tool_resources":null,
  "meta_data":null,
  "top_p":1.0,
  "temperature":1.0,
  "response_format":"auto",
  "vector_stores":[],
  "webhook_url":null}
```

### Delete assistant

```python
from projectdavid import Entity
client = Entity()

delete_assistant = client.assistants.delete_assistant(assistant_id=assistant.id)

```