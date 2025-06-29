# Quickstart

**Take your first steps with Entities API.**

The Entities API is a single, easy-to-use interface for open-weights text-generation models. It connects to multiple inference vendors, manages state, bundles advanced tools, and oversees the full function-call lifecycle so you can focus on building features instead of infrastructure.

Get started with this minimal example in a few easy steps.


---

```python
import os

from dotenv import load_dotenv
from projectdavid import Entity

load_dotenv()

# --------------------------------------------------
# Load the Entities client with your user API key
# Note: if you define ENTITIES_API_KEY="ea_6zZiZ..."
# in .env, you do not need to pass in the API key directly.
# We pass in here directly for clarity
# ---------------------------------------------------

client = Entity(
    base_url=os.getenv("BASE_URL", "http://localhost:9000"),
)

user_id = os.getenv("ENTITIES_USER_ID")

# -----------------------------
# create an assistant
# ------------------------------
assistant = client.assistants.create_assistant(
    name="test_assistant",
    instructions="You are a helpful AI assistant",
)
print(f"created assistant with ID: {assistant.id}")


# -----------------------------------------------
# Create a thread
# Note:
# - Threads are re-usable
# Reuse threads in the case you want as continued
# multi turn conversation
# ------------------------------------------------

thread = client.threads.create_thread()

print(f"created thread with ID: {thread.id}")

# -----------------------------------------
#  Create a message using the NEW thread ID
# --------------------------------------------
print(f"Creating message in thread {thread.id}...")
message = client.messages.create_message(
    thread_id=thread.id,
    role="user",
    content="Hello, assistant! Tell me about the latest trends in AI.",
    assistant_id=assistant.id,
)
print(f"Created message with ID: {message.id}")

# ---------------------------------------------
# step 3 - Create a run using the NEW thread ID
# ----------------------------------------------
run = client.runs.create_run(assistant_id=assistant.id, thread_id=thread.id)
print(f"Created run with ID: {run.id}")

# ------------------------------------------------
# Instantiate the synchronous streaming helper
# --------------------------------------------------
sync_stream = client.synchronous_inference_stream

# ------------------------------------------------------
# step 4 - Set up the stream using the NEW thread ID
# --------------------------------------------------------
sync_stream.setup(
    user_id=user_id,
    thread_id=thread.id,
    assistant_id=assistant.id,
    message_id=message.id,
    run_id=run.id,
    api_key=os.getenv("HYPERBOLIC_API_KEY"),
)
print("Stream setup complete. Starting streaming...")

# --- Stream initial LLM response ---
try:
    for chunk in sync_stream.stream_chunks(
        provider="Hyperbolic",
        model="hyperbolic/deepseek-ai/DeepSeek-V3-0324",
        timeout_per_chunk=15.0,
    ):
        content = chunk.get("content", "")
        if content:
            print(content, end="", flush=True)
    print("\n--- End of Stream ---")
except Exception as e:
    print(f"\n--- Stream Error: {e} ---")

print("Script finished.")
```

---

### Model selection 
Use the fully-qualified model name (FQMN) for the model you want to run. Entities works with a broad catalog of models; the complete list of supported models and their FQMNs is available in the model reference table.



### Provider-specific API keys
Entities can route your requests to several upstream inference providers (Hyperbolic, OpenAI, Mistral-AI, etc.).
You still need a separate key from whichever provider you choose.
Below we use Hyperbolic and pass its key via HYPERBOLIC_API_KEY.
