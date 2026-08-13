# SupportOS AI — Autonomous AI Customer Support SaaS

[![Backend CI](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/frontend-ci.yml)

SupportOS AI is an enterprise-grade, multi-tenant AI Customer Support SaaS platform designed to deliver autonomous, grounded customer support experiences. Powered by **FastAPI**, **Next.js 16 (App Router)**, **LangGraph agent workflows**, **Qdrant Vector Database RAG**, **Google Gemini**, and **Supabase PostgreSQL**, SupportOS AI combines high-speed AI responses with strict multi-tenant security and a modern dark AI SaaS aesthetic inspired by leading tools like Claude.

---

## 🌟 Key Features

- 🎨 **Premium AI SaaS UI/UX**: Cinematic dark aesthetic (`#050507`), fluid glowing background blobs, translucent glassmorphism panels, and smooth micro-interactions.
- 💬 **Claude-Style Rich Text Chat**: Progressive Markdown rendering, clean typography, document source chips, and action toolbars (Copy, Like, Dislike, Retry).
- 🧠 **Multi-Agent LangGraph Architecture**: Stateful agent workflow comprising Orchestrator, Knowledge Agent, Escalation Agent, FollowUp Agent, and Judge Agent.
- 🔍 **Multi-Tenant RAG Engine**: Vector similarity search in Qdrant with strict `tenant_id` payload isolation and similarity score filtering (`MIN_SEARCH_SCORE = 0.20`).
- 🔄 **Autonomous Human Escalation**: Automatic escalation trigger detection, creating support tickets in Supabase when human assistance is requested.
- 📊 **Tenant Analytics Dashboard**: Real-time metrics tracking AI resolution rate, total conversations, open/resolved tickets, and security audit status.
- 🔒 **Enterprise Multi-Tenancy & RLS**: JWT authentication, Supabase Row-Level Security (RLS), and RBAC role checks (`admin`, `user`).

---

## 🏗️ Architecture

```
USER → NEXT.JS FRONTEND → FASTAPI BACKEND → JWT & TENANT AUTH
                              ↓
                      LANGGRAPH GRAPH
                              ↓
                ┌─────────────┴─────────────┐
        Knowledge Agent              Escalation Agent
        (Qdrant RAG + Gemini)        (Auto Ticket Generation)
                └─────────────┬─────────────┘
                         Judge Agent
                              ↓
                      FINAL AI RESPONSE
```

For complete architectural details, read [docs/architecture.md](docs/architecture.md).

---

## 📁 Repository Structure

```
SupportOS-AI/
├── backend/
│   ├── app/
│   │   ├── agents/          # LangGraph agents & state graph
│   │   ├── auth/            # JWT dependencies & security
│   │   ├── core/            # Config, logger, exceptions, DB clients
│   │   ├── models/          # Pydantic data schemas
│   │   ├── routers/         # FastAPI endpoints (auth, chat, tickets, analytics)
│   │   └── services/        # Business logic services (Qdrant, Gemini, RAG, Tickets)
│   ├── tests/               # PyTest backend test suite
│   ├── main.py              # FastAPI application entry point
│   └── requirements.txt     # Python dependencies
├── frontend/
│   ├── app/                 # Next.js 16 App Router pages (chat, tickets, analytics)
│   ├── components/          # Dark theme glassmorphic UI components
│   ├── context/             # AuthContext session state
│   ├── services/            # Frontend API client services
│   └── public/              # Brand assets & static files
├── docs/                    # Architecture, backup, demo, & interview prep guides
└── .github/workflows/       # CI/CD pipelines for backend and frontend
```

---

## 🚀 Quick Start Guide

### Prerequisites
- Node.js v20+
- Python 3.12+
- Qdrant Cluster / Local Instance
- Supabase Project & Google Gemini API Key

### 1. Backend Setup
```bash
cd backend
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### 2. Frontend Setup
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000` in your browser.

---

## 🧪 Testing

Run backend PyTest suite:
```bash
cd backend
pytest -v
```

Build frontend Next.js production bundle:
```bash
cd frontend
npm run build
```

---

## 📚 Documentation & Guides

- 📐 [Architecture Specification](docs/architecture.md)
- 💾 [Disaster Recovery & Backup Runbook](docs/backup_recovery.md)
- 🎬 [Demo Walkthrough Guide](docs/demo_guide.md)
- 💼 [Interview Preparation Guide](docs/interview_prep.md)
