# SupportOS AI — Enterprise System Architecture Specification

## 1. Executive Summary

**SupportOS AI** is an enterprise multi-tenant AI Customer Support SaaS platform. It combines autonomous AI agents, retrieval-augmented generation (RAG) grounded in official company documents, automated human escalation, support ticket management, and real-time tenant analytics.

---

## 2. High-Level System Topology

```
                                  +-----------------------+
                                  |   Vercel Next.js 16   |
                                  |   Frontend Client     |
                                  +-----------+-----------+
                                              |
                                              | HTTPS / JWT Bearer Token
                                              v
                                  +-----------------------+
                                  |   Render FastAPI      |
                                  |   Backend Server      |
                                  +----+------+-------+---+
                                       |      |       |
                 +---------------------+      |       +---------------------+
                 |                            |                             |
                 v                            v                             v
       +------------------+         +-------------------+         +-------------------+
       |   Supabase Auth  |         |   Qdrant Cloud    |         |   Google Gemini   |
       |  & Postgres DB   |         |   Vector Storage  |         |   2.5 Flash LLM   |
       +------------------+         +-------------------+         +-------------------+
```

---

## 3. Core Component Architecture

### 3.1 Frontend (Next.js 16 App Router)
- **Panel Separation**: Distinct Admin Workspace (`/admin/*`) and Customer Portal (`/customer/*`) with independent layouts, navigation sidebars, and route authorization guards.
- **State Management**: `AuthContext` provides authenticated user profile, JWT session persistence (`localStorage`), and role-aware navigation.
- **Service Layer**: Decoupled API services ([auth.service.ts](file:///c:/Users/user/SupportOS-AI/frontend/services/auth.service.ts), [chat.service.ts](file:///c:/Users/user/SupportOS-AI/frontend/services/chat.service.ts), [ticket.service.ts](file:///c:/Users/user/SupportOS-AI/frontend/services/ticket.service.ts), [document.service.ts](file:///c:/Users/user/SupportOS-AI/frontend/services/document.service.ts), [analytics.service.ts](file:///c:/Users/user/SupportOS-AI/frontend/services/analytics.service.ts)).

### 3.2 Backend (FastAPI / Python)
- **Routers**: FastAPI routers for `/api/auth`, `/api/admin`, `/documents`, `/chat`, `/tickets`, `/api/analytics`, `/profile`, `/api/user`.
- **Services**: Business logic isolated inside modular services (`auth_service.py`, `chat_service.py`, `document_service.py`, `ticket_service.py`, `analytics_service.py`, `qdrant_service.py`, `gemini_service.py`).
- **LangGraph Agents**:
  - `orchestrator_agent.py`: Classifies intent into FAQ/Knowledge lookup vs. Human Escalation.
  - `knowledge_agent.py`: Executes vector retrieval & grounds Gemini generation in retrieved context.
  - `escalation_agent.py`: Automatically creates high-priority support tickets when escalation intent is detected.
  - `judge_agent.py`: Validates answers to prevent hallucination or out-of-scope policies.

---

## 4. Multi-Tenant Isolation Model

Tenant isolation is enforced across every layer:
1. **JWT Context**: Server extracts `tenant_id` from validated JWT claims (`sub`, `tenant_id`).
2. **Database RLS**: Supabase queries explicitly filter by `tenant_id = authenticated_tenant`.
3. **Qdrant Vector Isolation**: Vector search payloads enforce `FieldCondition(key="tenant_id", match=MatchValue(value=str(tenant_id)))` in collection `support_docs`.
