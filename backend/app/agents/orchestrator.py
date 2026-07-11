"""
=========================================================
File: orchestrator.py

Purpose:
Workflow Controller

Responsibilities:
1. Define Shared State
2. Start Workflow
3. Pass State to Next Agent

Flow

User Question
      │
      ▼
Orchestrator
      │
      ▼
Knowledge Agent
=========================================================
"""

from typing import TypedDict


# =========================================================
# Shared State
# =========================================================

class SupportState(TypedDict):

    # Tenant Identifier
    tenant_id: str

    # User Question
    question: str

    # Retrieved Context
    context: str

    # Retrieved Documents
    documents: list

    # Knowledge Agent Output
    draft_answer: str

    # Judge Agent Output
    final_answer: str


# =========================================================
# Orchestrator Agent
# =========================================================

def orchestrator(state):

    print("📌 Orchestrator Agent Started")

    # Future:
    # - Intent Detection
    # - Agent Selection
    # - Workflow Routing

    return state