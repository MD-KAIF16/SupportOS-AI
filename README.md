# SupportOS AI — Enterprise Autonomous AI Support SaaS Platform

[![Backend CI](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/MD-KAIF16/SupportOS-AI/actions)
[![Frontend Build](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/MD-KAIF16/SupportOS-AI/actions)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.138-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg?logo=next.js)](https://nextjs.org)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20DB-3ECF8E.svg?logo=supabase)](https://supabase.com)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20DB-dc2626.svg)](https://qdrant.tech)

**SupportOS AI** is an enterprise-grade multi-tenant AI Customer Support SaaS platform. It combines autonomous multi-agent graph workflows, retrieval-augmented generation (RAG) grounded in company policies, automated human support escalation, ticket management, and real-time tenant performance analytics.

---

## 🌟 Key Features

* **Admin Enterprise Workspace (`/admin/*`)**:
  * **Operational Console (`/admin/dashboard`)**: Live summary of indexed documents, support ticket breakdown, AI resolution rate, and high-priority escalation metrics.
  * **Knowledge Base Management (`/admin/knowledge-base`)**: Upload PDF, TXT, MD documents or submit raw text policies with automatic Gemini embedding generation & Qdrant vector indexing.
  * **Tenant Analytics (`/admin/analytics`)**: Isolated metrics for conversation activity, ticket resolution throughput, and AI efficiency.
  * **Ticket Oversight (`/admin/tickets`)**: View and manage customer tickets and escalated human support queues across status filters (`Open`, `Escalated`, `Pending`, `Resolved`).

* **Customer Portal (`/customer/*`)**:
  * **AI Support Chat (`/customer/chat`)**: Context-aware RAG chat grounded strictly in company documentation with anti-hallucination guardrails.
  * **My Support Tickets (`/customer/tickets`)**: Submit new support requests, view ticket status, and track agent updates.
  * **Customer Dashboard (`/customer/dashboard`)**: Central hub for support activity and quick chat initiation.

* **Multi-Tenant Security & RBAC**:
  * Strict separation between Admin Workspace and Customer Portal with server-side FastAPI role authorization (`require_role(["admin"])`).
  * Tenant data isolation enforced across Supabase database tables and Qdrant vector search queries (`tenant_id` payload filter).

---

## 🛠 Tech Stack

* **Frontend**: Next.js 16 (App Router), React 19, TypeScript, Vanilla CSS & Tailwind CSS, Lucide Icons.
* **Backend**: FastAPI, Python 3.14, Uvicorn, Pydantic v2, PyJWT.
* **Database & Auth**: Supabase Auth (Identity Management), Supabase Postgres (Relational Data & RLS).
* **Vector Storage**: Qdrant Cloud (`support_docs` vector collection).
* **AI & LLM**: Google Gemini 2.5 Flash (`gemini-2.5-flash`), Gemini Embeddings (`gemini-embedding-001`).
* **Agent Framework**: LangGraph multi-agent graph state workflow (Orchestrator, Knowledge Agent, Escalation Agent, Judge Agent).

---

## 📁 Repository Structure

```
SupportOS-AI/
├── backend/
│   ├── main.py                     # FastAPI Application & Router Registration
│   ├── requirements.txt            # Python Dependencies
│   ├── app/
│   │   ├── agents/                 # LangGraph Multi-Agent Workflows
│   │   │   ├── orchestrator_agent.py # Intent Classification (FAQ vs Escalation)
│   │   │   ├── knowledge_agent.py    # Vector Search & RAG Response Generation
│   │   │   ├── escalation_agent.py   # High-Priority Support Ticket Escalation
│   │   │   ├── judge_agent.py        # Hallucination Validation Guard
│   │   │   └── graph.py              # Compiled LangGraph Workflow
│   │   ├── auth/                   # Security & JWT Middleware
│   │   ├── core/                   # Config, Database, Qdrant & Supabase Clients
│   │   ├── models/                 # Pydantic Schemas & Data Models
│   │   ├── routers/                # FastAPI Endpoints (auth, admin, chat, documents, tickets, analytics)
│   │   └── services/               # Business Logic Services
│   └── tests/                      # Pytest Automated Test Suite
│       └── test_unit_suite.py
│
├── frontend/
│   ├── app/
│   │   ├── admin/                  # Admin Workspace Pages & Sidebar Layout
│   │   ├── customer/               # Customer Portal Pages & Top Header Layout
│   │   └── page.tsx                # Role-Based Entry & Auth Gateway
│   ├── components/                 # Reusable UI Components
│   ├── context/                    # AuthContext Session State
│   ├── services/                   # Frontend API Client Services
│   └── types/                      # TypeScript Type Definitions
│
└── docs/                           # Technical Specifications & Architecture Guides
    ├── architecture.md
    ├── authentication.md
    ├── authorization.md
    ├── ai-rag.md
    └── deployment.md
```

---

## 🚀 Local Development Setup

### 1. Prerequisites
- Python 3.10+
- Node.js 18+
- Supabase & Qdrant Cloud Credentials

### 2. Backend Setup
```bash
cd backend
python -m venv .venv
# Windows:
.\.venv\Scripts\activate
# Linux/macOS:
source .venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API docs available at: `http://127.0.0.1:8000/docs`

### 3. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Frontend web application available at: `http://localhost:3000`

---

## 🧪 Testing & Quality Assurance

### Run Backend Unit & Integration Tests
```bash
cd backend
.\.venv\Scripts\python.exe -m pytest tests/test_unit_suite.py -v
```

### Run Frontend Production Build
```bash
cd frontend
npm run build
```

---

## ☁️ Deployment

- **Backend**: Deployed on **Render** Web Service (`uvicorn main:app --host 0.0.0.0 --port $PORT`).
- **Frontend**: Deployed on **Vercel** (`NEXT_PUBLIC_API_URL=https://<your-render-backend>.onrender.com`).
- Detailed deployment instructions in [docs/deployment.md](file:///c:/Users/user/SupportOS-AI/docs/deployment.md).
