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

from langgraph.graph import MessagesState


# =========================================================
# Shared State
# =========================================================

class SupportState(MessagesState):

    # Tenant Identifier
    tenant_id: str = ""

    # Latest User Question
    question: str = ""

    # Retrieved Context
    context: str = ""

    # Retrieved Documents
    documents: list = []

    # Knowledge Agent Output
    draft_answer: str = ""

    # Judge Agent Output
    final_answer: str = ""


# =========================================================
# Orchestrator Agent
# =========================================================

def orchestrator(state: SupportState):

      print("\n📌 Orchestrator Agent Started")

      # Get latest user message
      last_message = state["messages"][-1]

      # Store latest question
      state["question"] = last_message.content
      
      print(f"Question : {state['question']}")

      # Future:
      # - Intent Detection
      # - Agent Selection
      # - Workflow Routing

      return state