# SupportOS AI

[![Backend CI](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/backend-ci.yml/badge.svg)](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/backend-ci.yml)
[![Frontend CI](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/frontend-ci.yml/badge.svg)](https://github.com/MD-KAIF16/SupportOS-AI/actions/workflows/frontend-ci.yml)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.138.1-009688.svg?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Next.js](https://img.shields.io/badge/Next.js-16.2-black.svg?logo=next.js)](https://nextjs.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Auth%20%26%20Postgres-3ECF8E.svg?logo=supabase)](https://supabase.com/)
[![Qdrant](https://img.shields.io/badge/Qdrant-Vector%20Database-dc2626.svg)](https://qdrant.tech/)
[![LangGraph](https://img.shields.io/badge/LangGraph-Agent%20Workflow-1C3C3C.svg)](https://www.langchain.com/langgraph)

> AI-powered customer support platform with role-based workspaces, knowledge-grounded assistance, automated escalation, ticket management, and multi-tenant data isolation.

---

## 🌐 Live Application

| Service | Link |
|---|---|
| **SupportOS AI** | [Open Application](https://supportos-ai-mocha.vercel.app/) |
| **Backend API** | [Open API](https://supportos-ai-backend.onrender.com/) |
| **API Documentation** | [Open Swagger Docs](https://supportos-ai-backend.onrender.com/docs) |
| **Health Check** | [Check Backend Health](https://supportos-ai-backend.onrender.com/health) |
| **GitHub Repository** | [MD-KAIF16/SupportOS-AI](https://github.com/MD-KAIF16/SupportOS-AI) |

---

## 📌 Overview

**SupportOS AI** is a multi-tenant customer support SaaS platform that helps organizations manage customer conversations, support requests, knowledge resources, and operational workflows from a single application.

The platform provides two separate role-based experiences:

- **Admin Workspace** — for managing the organization's support operation.
- **Customer Portal** — for customers seeking support and tracking their requests.

The AI Support system uses the organization's Knowledge Base to retrieve relevant information before generating responses. This allows support answers to be grounded in company-provided documentation rather than relying only on general model knowledge.

When a request requires human assistance, the system can escalate it into a support ticket for the support team.

---

# ✨ Key Features

## 🛡️ Admin Workspace

All administrative functionality is organized under `/admin/*`.

### Dashboard

`/admin/dashboard`

Provides an operational overview of:

- Support conversations
- Ticket activity
- Open and resolved requests
- Escalated requests
- Knowledge Base resources
- AI support performance

### Knowledge Base

`/admin/knowledge-base`

Admins can:

- Upload PDF documents
- Upload TXT documents
- Upload Markdown documents
- Add support policies as text
- Manage indexed resources
- Remove outdated documents

Knowledge resources are processed for semantic retrieval and made available to the AI Support workflow.

### Analytics

`/admin/analytics`

Provides tenant-level support metrics including:

- Conversation activity
- Ticket volume
- Open tickets
- Resolved tickets
- AI resolution metrics
- Support performance

### Ticket Management

`/admin/tickets`

Admins can:

- View customer support requests
- Review escalated requests
- Filter tickets by status
- Update ticket status
- Manage the support queue

Supported ticket states include:

- Open
- Pending
- Escalated
- Resolved

### AI Support

`/admin/chat`

Provides administrators with access to the support assistant and operational support workflows.

### Settings

`/admin/settings`

Provides organization and workspace configuration options.

---

# 👤 Customer Portal

Customer-facing functionality is organized under `/customer/*`.

### Customer Dashboard

`/customer/dashboard`

Provides:

- Recent support activity
- Active tickets
- Quick access to AI Support
- Account overview

### AI Support Chat

`/customer/chat`

Customers can ask support-related questions about:

- Billing
- Payments
- Refunds
- Account issues
- Product support
- Company policies

The system retrieves relevant Knowledge Base information before generating the response.

### My Support Tickets

`/customer/tickets`

Customers can:

- Create support requests
- View their own tickets
- Track ticket status
- Follow up on support issues

### Account Settings

`/customer/settings`

Customers can manage their account information and support preferences.

---

# 🤖 AI Support Architecture

SupportOS AI uses **LangGraph** as the primary orchestration framework for its multi-agent support workflow.

```text
Customer
   │
   ▼
Next.js Customer Portal
   │
   ▼
FastAPI API
   │
   ▼
Authentication & Authorization
   │
   ▼
Conversation History
   │
   ▼
Knowledge Retrieval
   │
   ▼
Qdrant Vector Search
   │
   ▼
Relevant Knowledge Base Documents
   │
   ▼
LangGraph Workflow
   │
   ├───────────────┐
   │               │
   ▼               ▼
Knowledge       Escalation
Agent              Agent
   │               │
   ▼               ▼
Gemini          Support Ticket
   │               │
   └───────┬───────┘
           ▼
     Judge / Validation
           │
           ▼
     Final Response
           │
           ▼
   Supabase Persistence
           │
           ▼
        Customer
````

---

## 🧩 Multi-Agent Workflow

### Orchestrator Agent

Analyzes the incoming request and determines which support workflow should handle it.

### Knowledge Agent

Searches the organization's Knowledge Base using Qdrant and prepares a response using the retrieved support information.

### Escalation Agent

Handles requests that require human intervention and creates an appropriate support ticket.

### Judge Agent

Validates the generated response before it is returned to the customer.

### Follow-up Agent

Supports conversational continuity and follow-up interactions.

---

# 🧠 Retrieval-Augmented Generation

The AI Support workflow uses retrieval before generation.

```text
Customer Question
       │
       ▼
Knowledge Search
       │
       ▼
Qdrant Vector Retrieval
       │
       ▼
Relevant Documents
       │
       ▼
Prompt Construction
       │
       ▼
Google Gemini
       │
       ▼
Response Validation
       │
       ▼
Customer Response
```

For example, if the Knowledge Base contains information about billing or refunds, a customer question about those topics can retrieve the corresponding documentation and use it as context for the generated response.

This approach helps keep support responses aligned with organization-provided information.

---

# 🔐 Security & Authorization

SupportOS AI implements role-based authorization and tenant-aware data access.

## Role Separation

### Admin

Administrative users can access:

```text
/admin/dashboard
/admin/knowledge-base
/admin/analytics
/admin/tickets
/admin/chat
/admin/settings
```

### Customer

Customer users can access:

```text
/customer/dashboard
/customer/chat
/customer/tickets
/customer/settings
```

Administrative APIs are protected by backend authorization.

Customers cannot use administrative APIs or access administrative resources.

---

# 🏢 Multi-Tenant Isolation

SupportOS AI is designed around tenant-aware data access.

Tenant context is applied across:

* Support conversations
* Tickets
* Knowledge Base resources
* Analytics
* Supabase database queries
* Qdrant vector searches

Qdrant retrieval uses tenant-specific filtering so knowledge resources from another tenant are not returned to the current tenant.

---

# 🔑 Authentication

Authentication is handled through **Supabase Auth** with backend authorization.

Supported authentication flows include:

* Sign in
* Customer registration
* Password recovery
* Session persistence
* Logout
* Role-based redirects

After successful authentication:

```text
Admin
  │
  ▼
/admin/dashboard


Customer
  │
  ▼
/customer/dashboard
```

Public registration creates Customer accounts. Users cannot self-register as administrators.

---

# 🛠️ Technology Stack

## Frontend

* Next.js 16 App Router
* React 19
* TypeScript
* Tailwind CSS
* CSS
* Lucide Icons

## Backend

* Python
* FastAPI
* Uvicorn
* Pydantic
* PyJWT

## Authentication & Database

* Supabase Auth
* Supabase PostgreSQL
* Row Level Security

## AI

* Google Gemini
* Gemini embeddings
* LangGraph
* LangChain Core tool abstractions

## Vector Search

* Qdrant Cloud

## Deployment

* Vercel
* Render

---

# 📁 Repository Structure

```text
SupportOS-AI/
│
├── backend/
│   ├── main.py
│   ├── requirements.txt
│   │
│   ├── app/
│   │   ├── agents/
│   │   │   ├── orchestrator_agent.py
│   │   │   ├── knowledge_agent.py
│   │   │   ├── escalation_agent.py
│   │   │   ├── followup_agent.py
│   │   │   ├── judge_agent.py
│   │   │   └── graph.py
│   │   │
│   │   ├── auth/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   └── services/
│   │
│   ├── scripts/
│   │   └── seed_demo_data.py
│   │
│   └── tests/
│       └── test_unit_suite.py
│
├── frontend/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── dashboard/
│   │   │   ├── knowledge-base/
│   │   │   ├── analytics/
│   │   │   ├── tickets/
│   │   │   ├── chat/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   │
│   │   ├── customer/
│   │   │   ├── dashboard/
│   │   │   ├── chat/
│   │   │   ├── tickets/
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   │
│   │   └── page.tsx
│   │
│   ├── components/
│   ├── context/
│   ├── services/
│   └── types/
│
├── docs/
│   ├── architecture.md
│   ├── authentication.md
│   ├── authorization.md
│   ├── ai-rag.md
│   └── deployment.md
│
└── README.md
```

### Directory Responsibilities

| Directory               | Responsibility                                       |
| ----------------------- | ---------------------------------------------------- |
| `backend/app/agents`    | AI workflow and agent orchestration                  |
| `backend/app/auth`      | Authentication and authorization helpers             |
| `backend/app/core`      | Infrastructure clients and application configuration |
| `backend/app/models`    | API and data schemas                                 |
| `backend/app/routers`   | HTTP API endpoints                                   |
| `backend/app/services`  | Application business logic                           |
| `backend/scripts`       | Operational and demo utilities                       |
| `backend/tests`         | Automated backend tests                              |
| `frontend/app/admin`    | Admin Workspace                                      |
| `frontend/app/customer` | Customer Portal                                      |
| `frontend/components`   | Reusable UI components                               |
| `frontend/context`      | Client-side authentication/session state             |
| `frontend/services`     | Frontend API services                                |
| `frontend/types`        | Shared TypeScript models                             |
| `docs`                  | Architecture and operational documentation           |

---

# 🚀 Local Development

## Prerequisites

* Python 3.10+
* Node.js 18+
* npm
* Supabase project
* Qdrant Cloud project
* Google Gemini API access

---

## 1. Clone the Repository

```bash
git clone https://github.com/MD-KAIF16/SupportOS-AI.git
cd SupportOS-AI
```

---

## 2. Backend Setup

```bash
cd backend

python -m venv .venv
```

### Windows

```powershell
.\.venv\Scripts\activate
```

### Linux / macOS

```bash
source .venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Start the backend:

```bash
uvicorn main:app --host 127.0.0.1 --port 8000 --reload
```

Local API:

```text
http://127.0.0.1:8000
```

Local Swagger documentation:

```text
http://127.0.0.1:8000/docs
```

---

# 3. Frontend Setup

```bash
cd frontend

npm install
npm run dev
```

Local application:

```text
http://localhost:3000
```

---

# 🧪 Testing & Quality Assurance

## Backend Tests

From the `backend` directory:

```powershell
.\.venv\Scripts\python.exe -m pytest -v
```

Focused unit suite:

```powershell
.\.venv\Scripts\python.exe -m pytest tests/test_unit_suite.py -v
```

The test suite covers areas including:

* Authentication
* JWT lifecycle
* Role-based authorization
* Customer/admin access control
* Tenant isolation
* Knowledge retrieval
* RAG workflow
* Ticket permissions
* Escalation
* Analytics
* AI workflow regression coverage

## Frontend Production Build

From the `frontend` directory:

```bash
npm run build
```

The production build verifies TypeScript compilation and Next.js route generation.

---

# ☁️ Production Deployment

## Frontend — Vercel

The Next.js frontend is deployed on Vercel.

**Production URL:**

[https://supportos-ai-mocha.vercel.app/](https://supportos-ai-mocha.vercel.app/)

The frontend uses:

```text
NEXT_PUBLIC_API_URL
```

to communicate with the backend API.

---

## Backend — Render

The FastAPI backend is deployed on Render.

**Production API:**

[https://supportos-ai-backend.onrender.com/](https://supportos-ai-backend.onrender.com/)

**Health Check:**

[https://supportos-ai-backend.onrender.com/health](https://supportos-ai-backend.onrender.com/health)

**Swagger API Documentation:**

[https://supportos-ai-backend.onrender.com/docs](https://supportos-ai-backend.onrender.com/docs)

Render start command:

```bash
uvicorn main:app --host 0.0.0.0 --port $PORT
```

For complete deployment instructions, see:

[Deployment Guide](docs/deployment.md)

---

# 🔄 Production Request Flow

A typical customer support interaction follows:

```text
Customer Login
      │
      ▼
Customer Dashboard
      │
      ▼
AI Support
      │
      ▼
Authenticated API Request
      │
      ▼
User & Tenant Validation
      │
      ▼
Conversation History
      │
      ▼
Knowledge Retrieval
      │
      ▼
Qdrant
      │
      ▼
Relevant Knowledge
      │
      ▼
LangGraph Workflow
      │
      ▼
Gemini
      │
      ▼
Response Validation
      │
      ▼
Conversation Persistence
      │
      ▼
Customer
```

### Human Escalation Flow

```text
Customer Request
      │
      ▼
Intent Detection
      │
      ▼
Escalation
      │
      ▼
Support Ticket
      │
      ▼
Admin Workspace
      │
      ▼
Human Support
```

---

# 🧱 Architecture Principles

SupportOS AI follows a modular separation-of-responsibility approach.

### Frontend

* Role-specific route structures
* Shared reusable components
* Centralized API services
* Shared TypeScript models
* Centralized authentication state

### Backend

* Routers handle HTTP requests
* Services contain business logic
* Agents handle AI workflow responsibilities
* Models define application contracts
* Core modules handle infrastructure clients
* Authentication and authorization remain server-enforced

This structure is intended to make the system easier to maintain, test, extend, and hand over to another developer.

---

# 🔒 Environment & Secret Safety

Environment variables must remain local and must never be committed to Git.

Typical sensitive configuration includes:

```text
GEMINI_API_KEY
Supabase credentials
Qdrant credentials
JWT secret
Database credentials
```

Keep environment files such as:

```text
.env
.env.local
backend/.env
```

out of version control.

---

# 📚 Documentation

Detailed technical documentation:

* [Architecture](docs/architecture.md)
* [Authentication](docs/authentication.md)
* [Authorization & RBAC](docs/authorization.md)
* [AI & RAG Pipeline](docs/ai-rag.md)
* [Deployment](docs/deployment.md)

---

# 📊 Project Status

| Component                 | Status        |
| ------------------------- | ------------- |
| Admin Workspace           | ✅ Implemented |
| Customer Portal           | ✅ Implemented |
| Authentication            | ✅ Implemented |
| Customer Signup           | ✅ Implemented |
| Password Recovery         | ✅ Implemented |
| Role-Based Access Control | ✅ Implemented |
| Knowledge Base            | ✅ Implemented |
| RAG Pipeline              | ✅ Implemented |
| Gemini Integration        | ✅ Implemented |
| LangGraph Workflow        | ✅ Implemented |
| Ticket Management         | ✅ Implemented |
| Human Escalation          | ✅ Implemented |
| Analytics                 | ✅ Implemented |
| Conversation History      | ✅ Implemented |
| Multi-Tenant Isolation    | ✅ Implemented |
| Production Frontend       | ✅ Deployed    |
| Production Backend        | ✅ Deployed    |
| Automated Backend Tests   | ✅ Implemented |
| Frontend Production Build | ✅ Verified    |

---

# 🔗 Links

### Application

**Live Application:**
[https://supportos-ai-mocha.vercel.app/](https://supportos-ai-mocha.vercel.app/)

### Backend

**API:**
[https://supportos-ai-backend.onrender.com/](https://supportos-ai-backend.onrender.com/)

**Swagger Docs:**
[https://supportos-ai-backend.onrender.com/docs](https://supportos-ai-backend.onrender.com/docs)

**Health:**
[https://supportos-ai-backend.onrender.com/health](https://supportos-ai-backend.onrender.com/health)

### Source Code

**GitHub:**
[https://github.com/MD-KAIF16/SupportOS-AI](https://github.com/MD-KAIF16/SupportOS-AI)

