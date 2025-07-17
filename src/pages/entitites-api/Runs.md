---
layout: api
title: Runs
---

A Run is a state-aware envelope that orchestrates one end-to-end interaction between an assistant and a thread.
The Run object serves multiple purposes in:
- Execution scaffold
- Lifecycle tracker
- Control surface
- Telemetry & billing

---

### Create Run

### Request body
|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`id`**   `string`                                                                                                                                                                                                                                                                                                                             
Unique message identifier (`message_JReXhnklVjq4qvmdGvXllG`).                                                                                                                                                                                                                                                                                  |
| **`assistant_id`** `string`                                                                                                                                                                                                                                                                                                                   
 The unique id of assistant associated with the message.                                                                                                                                                                                                                                                                            |
| **`attachments`** `list`                                                                                                                                                                                                                                                                                                                        
 A list of files attached to the message. This can be used to pass files to tools.                                                                                                                                                                                                                                                                                                                      |
| **`meta_data`** `<object>` or `null` `Optional`                                                                                                                                                                                                                                                                                                         
 A set of value pairs that can be attached to your message object. This is useful for storing additional arbitrary information about the assistant in a  structured format. These values can be used in queries via the API.Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters.                                                                                                                                                                                                                                                                                                   |
| **`content`** `string`                                                                                                                                                                                                                                                                                            
 A string value representing the inbound message per role.                                                                                                                                                                                                                                        |
| **`role`** `string`                                                                                                                                                                                                                                                                                            
 The role assigned to the user or AI entity that has authored the message. 
 - `user` A message authored at the consumer level                                                                                                                                                                                                                                        
 - `assistant` A message generated by the assistant; usually in response to the most recent message from the user or tool.
 - `tool` A special case role used to inject output from tool calls into the dialogue; not available for consumer use.



```python
from dotenv import load_dotenv
from projectdavid import Entity

load_dotenv()

client = Entity()

message = client.messages.create_message(
        thread_id="thread_L8PGee5yMiyl0TSVtjTxDC",
        role="user",
        content="Explain a black hole to me in pure mathematical terms",
        assistant_id="asst_5X2dIbKJsm8IgQTOAvK5WI",
    )


print(message.model_dump_json())
```


```json

{"id":"message_JReXhnklVjq4qvmdGvXllG",
  "assistant_id":"asst_5X2dIbKJsm8IgQTOAvK5WI",
  "attachments":[],
  "completed_at":null,
  "content":"Explain a black hole to me in pure mathematical terms",
  "created_at":1752019351,
  "incomplete_at":null,
  "incomplete_details":null,
  "meta_data":{},
  "object":"message",
  "role":"user",
  "run_id":null,
  "tool_id":null,
  "status":null,
  "thread_id":"thread_L8PGee5yMiyl0TSVtjTxDC",
  "sender_id":null}


```



### List messages

### Request body

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`thread_id`**   `string`                                                                                                                                                                                                                                                                                                                             
 Unique thread identifier (`thread_L8PGee5yMiyl0TSVtjTxDC"`).                                                                                                                                                                                                                                                                                  |


### Query parameters

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`limit`**   `Optional` Defaults to 20                                                                                                                                                                                                                                                                                                                            
 A limit on the number of objects to be returned.                                                                                                                                                                                                                                                                                  |
| **`order`**   `Optional` Defaults to `asc`                                                                                                                                                                                                                                                                                                                            
 Sort the order by the created_at timestamp. This can be either `asc` for ascending or `dsc` for descending order.                                                                                                                                                                                                                                                                                   |

```python
from dotenv import load_dotenv
load_dotenv()

from projectdavid import Entity
client = Entity()

list_messages = client.messages.list_messages(thread_id="thread_PqVZsXcaoqwVJ0PY309GOZ")
print(list_messages)

```

### Returns

```json
{"object":"list",
  "data":[{"id":"message_JReXhnklVjq4qvmdGvXllG", 
    "assistant_id":"asst_5X2dIbKJsm8IgQTOAvK5WI",
    "attachments":[],"completed_at":null,"content":"Explain a black hole to me in pure mathematical terms",
    "created_at":1752165639,
    "incomplete_at":null,
    "incomplete_details":null,
    "meta_data":{},
    "object":"message",
    "role":"user",
    "run_id":null,
    "tool_id":null,
    "status":null,
    "thread_id":"thread_L8PGee5yMiyl0TSVtjTxDC",
    "sender_id":null}],
  "first_id":"message_ChhX96M2RT10B5HUGcM027",
  "last_id":"message_ChhX96M2RT10B5HUGcM027",
  "has_more":false}
```


### Retrieve message

### Request body

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`message_id`**   `string`                                                                                                                                                                                                                                                                                                                             
 Unique thread identifier (`message_ChhX96M2RT10B5HUGcM027"`).                                                                                                                                                                                                                                                                                  |


```python
from dotenv import load_dotenv
load_dotenv()

from projectdavid import Entity
client = Entity()

retrieve_message = client.messages.retrieve_message("message_ChhX96M2RT10B5HUGcM027")
print(retrieve_message.model_dump_json())
```

### Returns
The message object matching the specified ID.
```json

{"id":"message_ChhX96M2RT10B5HUGcM027",
  "assistant_id":"asst_5X2dIbKJsm8IgQTOAvK5WI",
  "attachments":[],
  "completed_at":null,
  "content":"Explain a black hole to me in pure mathematical terms",
  "created_at":1752171229,
  "incomplete_at":null,
  "incomplete_details":null,
  "meta_data":{},
  "object":"message",
  "role":"user",
  "run_id":null,
  "tool_id":null,
  "status":null,
  "thread_id":"thread_ssywmQxd6h4zJFBpjdCh3S",
  "sender_id":null}


```


### Delete Message

### Request body

|                                                                                                                                                                                                                                                                                                                                      |
|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`message_id`**   `string`                                                                                                                                                                                                                                                                                                                             
 Unique thread identifier (`thread_L8PGee5yMiyl0TSVtjTxDC"`).                                                                                                                                                                                                                                                                                  |


```python
from dotenv import load_dotenv
load_dotenv()

from projectdavid import Entity
client = Entity()

delete_message = client.messages.delete_message("message_ChhX96M2RT10B5HUGcM027")
print(delete_message.model_dump_json())

```

### Returns

```json

{ "id":"message_gOGcuOIPWAxXvLunWJa2OR",
  "object":"thread.message.deleted",
  "deleted":true}

```



### The message object

|                                                                                                                                                                                                                                                                                                                                                |
|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **`message_id`**   `string`
 Unique thread identifier (`thread_L8PGee5yMiyl0TSVtjTxDC"`).                                                                                                                                                                                                                                                                                   |
| **`attachments`** `list`                                                                                                                                                                                                                                                                                                                       
 A list of files attached to the message. This can be used to pass files to tools.                                                                                                                                                                                                                                                              |
| **`completed_at`** `integer` or `null`                                                                                                                                                                                                                                                                                                         
| **`content`** `string`                                                                                                                                                                                                                                                                                                                         
 A string value representing the inbound message per role.                                                                                                                                                                                                                                                                                      |
 A Unix style time stamp, depicting when the  message was finished.                                                                                                                                                                                                                                                                             |
| **`created_at`** `integer` or `null`                                                                                                                                                                                                                                                                                                           
 A Unix style time stamp, depicting when the  message was created.                                                                                                                                                                                                                                                                              |
| **`incomplete_at`** `integer` or `null`                                                                                                                                                                                                                                                                                                        
 A Unix style time stamp, depicting when the  message was incomplete.                                                                                                                                                                                                                                                                           |
| **`meta_data`** `integer` or `null`                                                                                                                                                                                                                                                                                                            
 A set of value pairs that can be attached to your message object. This is useful for storing additional arbitrary information about the assistant in a  structured format. These values can be used in queries via the API.Keys are strings with a maximum length of 64 characters. Values are strings with a maximum length of 512 characters |
| **`object`** `string`                                                                                                                                                                                                                                                                                                                         | 
The object type.
**`run_id`** `string`                                                                                                                                                                                                                                                                                                           
The ID of the run associated with the message.
**`status`** `string`                                                                                                                                                                                                                                                                                                           
The status of the message: `in_progress`, `incomplete`, or `complete`.
**`role`** `string`                                                                                                                                                                                                                                                                                            
 
The role assigned to the user or AI entity that has authored the message. 
 - `user` A message authored at the consumer level                                                                                                                                                                                                                                        
 - `assistant` A message generated by the assistant; usually in response to the most recent message from the user or tool.
 - `tool` A special case role used to inject output from tool calls into the dialogue; not available for consumer use.



```json

{"id":"message_8IHhGD797UWVwm7HJeSKzf",
  "assistant_id":"asst_5X2dIbKJsm8IgQTOAvK5WI",
  "attachments":[],
  "completed_at":null,
  "content":"Explain a black hole to me in pure mathematical terms",
  "created_at":1752600602,
  "incomplete_at":null,
  "incomplete_details":null,
  "meta_data":{},
  "object":"message",
  "role":"user",
  "run_id":null,
  "tool_id":null,
  "status":null,
  "thread_id":"thread_Vz3JDUrz98sKvPG8bVB2u0",
  "sender_id":null}


```





