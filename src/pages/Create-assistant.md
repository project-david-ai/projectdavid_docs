---
layout: api
title: Create Assistant
---

Build an assistant with access to tools to perform tasks.

### Request body

| Name          | Type           | Description                                    |
| ------------- | -------------- | ---------------------------------------------- |
| `model`       | string         | **Required**. The ID of the model to use...    |
| `description` | string or null | Optional. The description of the assistant...  |
| `instructions`| string or null | The system instructions that the assistant uses. |


```python
import os

from projectdavid import Entity

client = Entity()

# Create assistant

assistant = client.assistants.create_assistant(
    name="Mathy",
    description="test_case",
    model='llama3.1',
    instructions="You are a helpful math tutor."
)

print(f"{assistant}")
```

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

