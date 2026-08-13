# SupportOS AI — Technical Deep Dive & Interview Preparation Guide

This guide equips you to answer complex technical questions about the architecture, choices, multi-tenancy, RAG, agent workflows, security, and scalability of SupportOS AI.

---

## 1. Core Architecture & Tech Stack Decisions

### Q1: Why FastAPI for the backend instead of Node.js / Express?
**Answer**:
FastAPI provides native asynchronous execution (`async/await`), automatic OpenAPI documentation generation, and high performance powered by Starlette and Pydantic. Since Python is the native ecosystem for AI frameworks like LangGraph, LangChain, and Qdrant client, using FastAPI eliminates IPC/cross-language serialization overhead between web handlers and AI graph nodes.

### Q2: How is Next.js 16 App Router utilized?
**Answer**:
Next.js 16 provides optimized client/server component separation, CSS variables integration with Tailwind CSS v4, dynamic client state restoration in `AuthContext`, and layout persistence. The design uses CSS backdrop filters and keyframe animations to deliver a premium AI SaaS visual experience inspired by Claude.

---

## 2. Multi-Tenancy, RLS & Vector Isolation

### Q3: How do you guarantee Tenant A cannot read Tenant B data?
**Answer**:
Multi-tenancy is enforced at three distinct layers:
1. **API Auth Middleware**: The `get_current_user` dependency verifies the incoming JWT, extracts `user_id` and `tenant_id` from the database, and injects `current_user` into request handlers. Frontend parameters like `tenant_id` are never trusted blindly.
2. **Qdrant Vector DB Filtering**: Every similarity search specifies a mandatory payload filter:
   ```python
   Filter(must=[FieldCondition(key="tenant_id", match=MatchValue(value=str(tenant_id)))])
   ```
   This guarantees Qdrant never returns document chunks belonging to another tenant.
3. **Database Row-Level Security (RLS)**: PostgreSQL tables (`conversations`, `tickets`, `user_profiles`) enforce RLS policies restricting read/write operations to records matching the authenticated user's `tenant_id`.

---

## 3. LangGraph & Multi-Agent Workflow Design

### Q4: Explain the LangGraph state graph execution flow.
**Answer**:
The workflow uses a custom `SupportState` extending `MessagesState`:
- **START** -> `orchestrator`: Validates message, checks escalation triggers.
- **Conditional Routing**:
  - If escalation keywords match -> `escalation_agent` -> `judge_agent` -> **END**.
  - If standard FAQ/support question -> `knowledge_agent` -> `followup_agent` -> `judge_agent` -> **END**.
- `knowledge_agent`: Loads user profile, conversation history, executes Qdrant vector retrieval, constructs multi-section prompt, and queries Gemini.
- `judge_agent`: Sanitizes and validates final answer before sending to frontend.

---

## 4. Resilience & Error Handling

### Q5: What happens if Gemini API or Qdrant fails?
**Answer**:
- **Qdrant Failure**: Caught gracefully in `knowledge_agent`; fallback sets `documents = []` and continues prompt generation using conversation memory so the assistant can still help with non-RAG queries.
- **Gemini Failure**: Handled in `gemini_service.py` and `knowledge_agent.py`, returning a user-friendly error response while logging detailed tracebacks without crashing the server.
