---
title: Assistant Cache
category: architecture
slug: archi-assistant-cache
nav_order: 2
---



````mermaid
%%{init: {
  "theme": "base",
  "themeVariables": {
    "background": "#f8f9fc",
    "primaryColor": "#dbeafe",
    "primaryTextColor": "#1e3a5f",
    "primaryBorderColor": "#3b82f6",
    "secondaryColor": "#fef3c7",
    "secondaryTextColor": "#78350f",
    "secondaryBorderColor": "#f59e0b",
    "tertiaryColor": "#ede9fe",
    "tertiaryTextColor": "#4c1d95",
    "tertiaryBorderColor": "#7c3aed",
    "nodeTextColor": "#1e293b",
    "edgeLabelBackground": "#f1f5f9",
    "clusterBkg": "#f8faff",
    "clusterBorder": "#cbd5e1",
    "titleColor": "#1e293b",
    "lineColor": "#94a3b8",
    "fontSize": "18px",
    "fontFamily": "Georgia, serif"
  }
}}%%
graph TD
    Caller([Inference Worker\nor API Route])
    Platform([ProjectDavid Platform\nEntity Client])

    subgraph Arbiter ["InferenceArbiter — Gate-keeper"]
        direction TB
        ArbiterInit[__init__\nAccepts Sync or Async Redis]
        URLReconstruct[_reconstruct_url\nAsync to Sync Redis URL]
        ProviderFactory[get_provider_instance\nNEW instance per run — no caching]
    end

    subgraph Cache ["AssistantCache — Shared Infrastructure"]
        direction TB
        CacheKey[_cache_key\nassistant-id-config]

        subgraph ReadPath ["Read Path"]
            GetOp[get\nAsync or thread-wrapped sync]
            CacheHit{Cache Hit?}
            ReturnCached[Return Cached Payload]
        end

        subgraph WritePath ["Write Path"]
            FetchPlatform[retrieve\nFetch from Platform API]
            NormalizeTools[Normalize Tools\ndict / model_dump / .dict]
            NormalizeMeta[_normalize_bool\nstr/int/bool to bool]
            BuildPayload[Build Payload\ninstructions, tools, agent_mode\nweb_access, deep_research\nmeta_data, is_research_worker]
            SetOp[set\nJSON serialize + TTL]
        end

        subgraph InvalidatePath ["Invalidate Path"]
            DeleteOp[delete\nAsync]
            InvalidateSync[invalidate_sync\nSync wrapper]
            RetrieveSync[retrieve_sync\nasyncio.run wrapper]
        end
    end

    subgraph RedisLayer ["Redis — Cache Storage"]
        direction TB
        SyncClient[redis.Redis\nSync Client]
        AsyncClient[redis.asyncio.Redis\nAsync Client]
        TTLStore[(Key-Value Store\nTTL default 300s)]
    end

    Caller --> |"Inject redis client"| ArbiterInit
    ArbiterInit --> |"Async Redis detected"| URLReconstruct
    URLReconstruct --> |"Reconstructed URL"| ArbiterInit
    ArbiterInit --> |"Instantiates shared cache"| CacheKey
    Caller --> |"Request provider"| ProviderFactory
    ProviderFactory --> |"Passes assistant_cache ref"| GetOp

    Caller ==> |"retrieve(assistant_id)"| GetOp
    GetOp --> CacheKey
    CacheKey --> GetOp
    GetOp --> CacheHit
    CacheHit -- "Yes" --> ReturnCached
    ReturnCached -.-> Caller

    CacheHit -- "No - miss" --> FetchPlatform
    FetchPlatform --> |"assistants.retrieve_assistant"| Platform
    Platform -.-> |"Assistant object"| FetchPlatform
    FetchPlatform --> NormalizeTools
    FetchPlatform --> NormalizeMeta
    NormalizeTools --> BuildPayload
    NormalizeMeta --> BuildPayload
    BuildPayload --> SetOp
    SetOp ==> |"JSON + TTL"| TTLStore
    SetOp -.-> |"Return payload"| Caller

    GetOp --> |"GET key"| TTLStore
    TTLStore -.-> |"Raw JSON"| GetOp

    SyncClient --> TTLStore
    AsyncClient --> TTLStore

    InvalidateSync --> DeleteOp
    RetrieveSync --> |"asyncio.run"| FetchPlatform
    DeleteOp --> |"DEL key"| TTLStore

    classDef main fill:#dbeafe,stroke:#3b82f6,stroke-width:1.5px,color:#1e3a5f
    classDef worker fill:#fef3c7,stroke:#f59e0b,stroke-width:1.5px,color:#78350f
    classDef external fill:#dcfce7,stroke:#22c55e,stroke-width:1.5px,color:#14532d
    classDef bridge fill:#ede9fe,stroke:#7c3aed,stroke-width:1.5px,color:#4c1d95

    class ArbiterInit,URLReconstruct,ProviderFactory main
    class GetOp,CacheHit,ReturnCached,FetchPlatform,NormalizeTools,NormalizeMeta,BuildPayload,SetOp,CacheKey worker
    class DeleteOp,InvalidateSync,RetrieveSync bridge
    class SyncClient,AsyncClient,TTLStore,Caller,Platform external

    style Arbiter fill:#eff6ff,stroke:#93c5fd,color:#1e3a5f
    style Cache fill:#fffbeb,stroke:#fcd34d,color:#78350f
    style ReadPath fill:#fef9ee,stroke:#fbbf24,color:#78350f
    style WritePath fill:#fef9ee,stroke:#fbbf24,color:#78350f
    style InvalidatePath fill:#f5f3ff,stroke:#a78bfa,color:#4c1d95
    style RedisLayer fill:#f0fdf4,stroke:#86efac,color:#14532d
   ````