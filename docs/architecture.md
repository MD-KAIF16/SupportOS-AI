# SupportOS AI — Architecture & Multi-Tenancy Specification

## System Overview

SupportOS AI is a production-grade multi-tenant AI customer support SaaS platform built with FastAPI, Next.js 16 (App Router), LangGraph, Qdrant Vector Database, Google Gemini, and Supabase PostgreSQL.

---

## 1. High-Level System Architecture Diagram

```mermaid
graph TD
    User["User / Frontend Client"] -->|HTTPS / REST| NextJS["Next.js 16 Frontend"]
    NextJS -->|JWT Auth Header| FastAPI["FastAPI Backend Server"]
    
    subgraph Security Layer
        FastAPI --> AuthDep["get_current_user Dependency"]
        AuthDep --> SupabaseAuth["Supabase JWT Verification"]
        AuthDep --> TenantFilter["Enforce tenant_id & RBAC Role"]
    end
    
    subgraph Agentic Orchestration Layer
        TenantFilter --> LangGraph["LangGraph Workflow Graph"]
        LangGraph --> Orchestrator["Orchestrator Agent"]
        Orchestrator -->|RAG Question| KnowledgeAgent["Knowledge Agent"]
        Orchestrator -->|Escalation Request| EscalationAgent["Escalation Agent"]
        KnowledgeAgent --> FollowUpAgent["FollowUp Agent"]
        FollowUpAgent --> JudgeAgent["Judge Agent"]
        EscalationAgent --> JudgeAgent
    end

    subgraph Data & Storage Layer
        KnowledgeAgent -->|Embeddings| GeminiEmbed["Gemini gemini-embedding-001"]
        KnowledgeAgent -->|tenant_id Filter Search| Qdrant["Qdrant Vector DB"]
        KnowledgeAgent -->|Prompt Generation| GeminiLLM["Gemini LLM"]
        EscalationAgent -->|Create Ticket| SupabaseDB[("Supabase PostgreSQL")]
        FastAPI -->|Conversations & Analytics| SupabaseDB
    end

    JudgeAgent -->|Final Approved Response| FastAPI
    FastAPI -->|APIResponse| NextJS
```

---

## 2. Multi-Tenancy Security & Data Isolation Architecture

```mermaid
sequenceDiagram
    autonumber
    participant Client as Frontend Client
    participant API as FastAPI Router
    participant Auth as Auth Dependency
    participant Qdrant as Qdrant Vector DB
    participant DB as Supabase DB (RLS)

    Client->>API: POST /chat { question } + Authorization Bearer JWT
    API->>Auth: Verify JWT & fetch user profile
    Auth-->>API: Return User { id, tenant_id, role }
    API->>Qdrant: Search points filter [ FieldCondition("tenant_id") == user.tenant_id ]
    Qdrant-->>API: Return Tenant-Isolated Knowledge Documents
    API->>DB: Save Conversation [ user_id, tenant_id ]
    DB-->>API: Persisted
    API-->>Client: Return Chat Response + Documents
```

### Multi-Tenancy Rules
1. **Tenant Identification**: Every user belongs to a `tenant_id` stored in the `users` table.
2. **Qdrant Vector Isolation**: All Qdrant `query_points` searches strictly filter by payload `tenant_id`:
   ```python
   FieldCondition(
       key="tenant_id",
       match=MatchValue(value=str(tenant_id))
   )
   ```
3. **PostgreSQL RLS Policies**: Database tables (`conversations`, `tickets`, `user_profiles`) restrict access via Row-Level Security policies ensuring Tenant A never accesses Tenant B data.

---

## 3. Agentic Workflow Architecture (LangGraph)

1. **Orchestrator Agent**:
   - Inspects the latest user message.
   - Evaluates escalation keywords (`human`, `agent`, `escalate`).
   - Routes request to either `escalation_agent` or `knowledge_agent`.
2. **Knowledge Agent**:
   - Loads user profile (Digital Twin) and conversation memory history.
   - Executes RAG retrieval against Qdrant.
   - Prompts Gemini to generate grounded answer.
3. **Escalation Agent**:
   - Automatically creates an escalated ticket record in Supabase.
   - Generates human transfer response.
4. **FollowUp Agent**:
   - Polishes draft answer and ensures state readiness.
5. **Judge Agent**:
   - Validates response quality, formatting, and safety before releasing to API response.
