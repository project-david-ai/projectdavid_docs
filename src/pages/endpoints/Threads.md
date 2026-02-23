---
layout: api
title: Threads
---

Threads encapsulate contiguous messages exchanged between the user and the assistant. Each thread
holds the user’s prompts, the assistant’s replies, and any tool-generated outputs, forming a curated 
record of a multi-turn conversation.

---

### Create thread

### Request body

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`id`**   `string`                                                                                                                                                                                                                                                                                                                             
 Unique assistant identifier (`thread_L8PGee5yMiyl0TSVtjTxDC"`).                                                                                                                                                                                                                                                                                  |
| **`created_at`** `integer` (Unix-epoch)                                                                                                                                                                                                                                                                                                                   
 Creation timestamp in seconds (`1751169829`).                                                                                                                                                                                                                                                                            |
| **`object`** `assistant`                                                                                                                                                                                                                                                                                                                        
 Object type discriminator.                                                                                                                                                                                                                                                                                                                      |
| **`meta_data`** `<object>` or `null` `Optional`                                                                                                                                                                                                                                                                                                         
 A set of value pairs that can be attached to your thread object. This is useful for storing additional arbitrary information about the assistant in a  structured format. These values can be used in queries via the API.Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.                                                                                                                                                                                                                                                                                                   |
| **`tool_resources`** `<object>` or `null` `Optional`                                                                                                                                                                                                                                                                                            
 Per-tool resource map keyed by tool type. Example:`{"file_search":{"vector_store_ids":["vs_docs"]}}`                                                                                                                                                                                                                                        |


```python
from dotenv import load_dotenv
load_dotenv()

from projectdavid import Entity
client = Entity()

thread = client.threads.create_thread()
print(thread.model_dump_json())
```


```json

{"id":"thread_L8PGee5yMiyl0TSVtjTxDC",
  "created_at":1751825603,
  "meta_data":{},
  "object":"thread",
  "tool_resources":{}}

```



### Retrieve thread

### Request body

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`thread_id`**   `string`                                                                                                                                                                                                                                                                                                                             
 Unique thread identifier (`thread_L8PGee5yMiyl0TSVtjTxDC"`).                                                                                                                                                                                                                                                                                  |




```python
from dotenv import load_dotenv
load_dotenv()

from projectdavid import Entity
client = Entity()

retrieve_thread = client.threads.retrieve_thread("thread_PqVZsXcaoqwVJ0PY309GOZ")
print(thread.model_dump_json())
```

### Returns

```json

{"id":"thread_PqVZsXcaoqwVJ0PY309GOZ",
  "created_at":1751826987,
  "meta_data":{},
  "object":"thread",
  "tool_resources":{}}
```


### Update thread

### Request body

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`thread_id`**   `string`                                                                                                                                                                                                                                                                                                                             
 Unique thread identifier (`thread_L8PGee5yMiyl0TSVtjTxDC"`).                                                                                                                                                                                                                                                                                |
| **`metadata`**   `<object>` or `null` `Optional`                                                                                                                                                                                                                                                                                                                             
 A set of value pairs that can be attached to your assistant object. This is useful for storing additional arbitrary information about the assistant in a  structured format. These values can be used in queries via the API.Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.                                                                                                                                                                                                                                                                                |
| **`tool_resources`** `<object>` or `null` `Optional`                                                                                                                                                                                                                                                                                            
 Per-tool resource map keyed by tool type. Example:`{"file_search":{"vector_store_ids":["vs_docs"]}}`                                                                                                                                                                                                                                        |



```python
from dotenv import load_dotenv
load_dotenv()

from projectdavid import Entity
client = Entity()

update_thread = client.threads.update_thread("thread_L8PGee5yMiyl0TSVtjTxDC",
                                           meta_data={
                                               "modified": "true",
                                               "user": "abc123"
                                             }

                                             )


print(update_thread.model_dump_json())
```

### Returns
The modified thread object matching the specified ID.
```json

{"id":"thread_B2C2CCLwOLcgmDHEvTWtNZ",
  "created_at":1752015613,
  "meta_data":{"user":"abc123","modified":"true"},
  "object":"thread",
  "tool_resources":{},
  "participants":[{"id":"user_2KYnOOcCpysZyL25sOR46H", 
    "email":"test_regular_user_1748656525@example.com", 
    "full_name":"Regular User Test"}]}

```


### Delete thread

### Request body

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`thread_id`**   `string`                                                                                                                                                                                                                                                                                                                             
 Unique thread identifier (`thread_L8PGee5yMiyl0TSVtjTxDC"`).                                                                                                                                                                                                                                                                                  |




```python
from dotenv import load_dotenv
load_dotenv()

from projectdavid import Entity
client = Entity()

delete_thread = client.threads.delete_thread("thread_L8PGee5yMiyl0TSVtjTxDC")
print(delete_thread.model_dump_json())
```

### Returns

```json

{
  "id": "thread_L8PGee5yMiyl0TSVtjTxDC",
  "object": "thread.deleted",
  "deleted": true
}

```








