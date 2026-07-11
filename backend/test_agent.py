"""
=========================================================
File: test_agent.py

Purpose:
Test LangGraph Multi-Agent Workflow

Flow

Question
    │
    ▼
graph.invoke()
    │
    ▼
Orchestrator
    │
    ▼
Knowledge Agent
    │
    ▼
Judge Agent
    │
    ▼
Print Final Answer
=========================================================
"""

from app.agents.graph import graph


# =========================================================
# Initial Shared State
# =========================================================

state = {
    "tenant_id": "83984207-48dd-453f-9fb7-cb7f18bf82e3",
    "question": "What is the refund policy?",
    "context": "",
    "documents": [],
    "draft_answer": "",
    "final_answer": "",
}


# =========================================================
# Run Graph
# =========================================================

result = graph.invoke(state)


# =========================================================
# Print Output
# =========================================================

print("\n==============================")
print("Final Answer")
print("==============================")

print(result["final_answer"])