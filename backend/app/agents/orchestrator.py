"""
=========================================================
File: orchestrator.py

Purpose:
Workflow Controller

Responsibilities:
1. Read latest user message
2. Decide which agent should handle the request
3. Update shared workflow state

Flow

User
   │
   ▼
Orchestrator
   │
   ▼
Knowledge Agent
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from app.agents.state import SupportState


# =========================================================
# Orchestrator Agent
# =========================================================

def orchestrator(state: SupportState):

    print("\n📌 Orchestrator Agent Started")

    # -----------------------------------------------------
    # Read Latest User Message
    # -----------------------------------------------------

    last_message = state["messages"][-1]

    # Save latest question
    state["question"] = last_message.content

    print(f"Question : {state['question']}")

    # -----------------------------------------------------
    # Current Routing Logic
    # -----------------------------------------------------

    state["next_agent"] = "knowledge_agent"

    print(f"Next Agent : {state['next_agent']}")

    print("✅ Orchestrator Agent Finished")

    return state