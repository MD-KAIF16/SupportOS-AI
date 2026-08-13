# SupportOS AI — AI Agent Architecture & RAG Pipeline

## 1. Multi-Agent LangGraph Workflow

SupportOS AI uses a directed multi-agent graph orchestrated with **LangGraph**:

```
                       [ Customer Question ]
                                 |
                                 v
                       +-------------------+
                       | Orchestrator Agent|
                       +---------+---------+
                                 |
           +---------------------+---------------------+
           | Intent: FAQ/Query                         | Intent: Human Escalation
           v                                           v
 +-------------------+                       +-------------------+
 |  Knowledge Agent  |                       | Escalation Agent  |
 | (Qdrant Vector    |                       | (Creates Escalated|
 |   Retrieval)      |                       | High-Priority Tix)|
 +---------+---------+                       +---------+---------+
           |                                           |
           +---------------------+---------------------+
                                 |
                                 v
                       +-------------------+
                       |    Judge Agent    |
                       | (Hallucination    |
                       |   Validation)     |
                       +---------+---------+
                                 |
                                 v
                        [ Grounded Reply ]
```

---

## 2. RAG Component Workflow

1. **Embedding Generation**: Uses Google Gemini `gemini-embedding-001` (768 dimensions).
2. **Vector Indexing**: Document chunks indexed into Qdrant cloud collection `support_docs` with `tenant_id` payload metadata.
3. **Contextual Retrieval**: Qdrant search filters by `tenant_id` and score threshold (`MIN_SEARCH_SCORE = 0.20`), retrieving top $K=3$ document chunks.
4. **Answer Grounding**: Gemini `gemini-2.5-flash` receives retrieved context and generates factual response without hallucinating out-of-scope policies.
