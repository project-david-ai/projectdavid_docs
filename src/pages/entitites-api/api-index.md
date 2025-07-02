
# API Overview

The Entities API lets you build AI assistants (agents) that slot cleanly into your own applications.
An assistant is a fully-decoupled entity: you give it its own system instructions and grant access 
to the tools or function calls it needs.


Behind the scenes an assistant can tap into a wide range of open-weight models and inference providers 
through one cohesive, stateful API.


All endpoints are plain-REST compliant, but for the smoothest developer experience we recommend using 
the official SDK.

## How Entities Works





```plaintext
┌──────────┐   ┌────────┐   ┌──────────┐   ┌──────┐   ┌────────────┐
│ Assistant│──►│ Thread │──►│ Message  │──►│ Run  │──►│ Inference  │
└──────────┘   └────────┘   └──────────┘   └──────┘   └────────────┘
                                         │
                                         ▼
                                 ┌────────────────┐
                                 │  Run steps     │
                                 │  Run status    │
                                 └────────────────┘
```

| Object           | Purpose                                                                     |
|------------------|-----------------------------------------------------------------------------|
| [**Assistant**](https://docs.projectdavid.co.uk/docs/Create-assistant)    | A distinct AI entity configured with access to specific tools and behavior. |

---

|            |                                                                                                                                                                                                                                        |
|------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| [**Thread**](https://docs.projectdavid.co.uk/docs/Threads) | A thread is a conversation session between a user and an assistant. It stores the full history of messages exchanged during the session and automatically manages truncation as token limits approach the context window of the model. |


---

|             |                                                                                                                                                                                  |
|-------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Message** | Messages represent individual turns in a conversation. Each message has a role—either system, user, assistant, or tool—and all messages are stored sequentially within a thread. |


---


|         |                                                                                                                                                                                  |
|---------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Run** | A Run maintains the in-flight state of each message within a thread. It mediates tool invocation and downstream function calls on behalf of the assistant. Run steps provide a structured trace of each action taken by the assistant during the process of generating a final message. |


---


|               |                                                                                                                                                                                  |
|---------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Inference** | Inference takes the constructed context from the thread and message stages and passes it to the selected AI model for final response generation. Entities supports both local inference and a range of cloud-based providers. |



[**Assistant**](http://localhost:5174/docs/Create-assistant)


[**Thread**](http://localhost:5174/docs/Create-assistant)

