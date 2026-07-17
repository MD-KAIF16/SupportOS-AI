"""
=========================================================
File: graph.py

Purpose:
Create LangGraph Workflow

Responsibilities:
1. Register all agents
2. Connect workflow
3. Compile graph

Current Flow

START
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
END
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from langgraph.graph import (
    StateGraph,
    START,
    END,
)

from app.agents.state import SupportState
from app.agents.orchestrator_agent import orchestrator
from app.agents.knowledge_agent import knowledge_agent
from app.agents.judge_agent import judge_agent


# =========================================================
# Create Workflow Builder
# =========================================================

builder = StateGraph(SupportState)


# =========================================================
# Register Nodes
# =========================================================

builder.add_node(
    "orchestrator",
    orchestrator,
)

builder.add_node(
    "knowledge_agent",
    knowledge_agent,
)

builder.add_node(
    "judge_agent",
    judge_agent,
)


# =========================================================
# Routing Function
# =========================================================

def route_from_orchestrator(
    state: SupportState,
) -> str:
    """
    Returns the next node selected by the
    Orchestrator Agent.
    """

    return state.get(
        "next_agent",
        "knowledge_agent",
    )


# =========================================================
# Workflow
# =========================================================

builder.add_edge(
    START,
    "orchestrator",
)

builder.add_conditional_edges(
    "orchestrator",
    route_from_orchestrator,
    {
        "knowledge_agent": "knowledge_agent",
        "judge_agent": "judge_agent",
    },
)

builder.add_edge(
    "knowledge_agent",
    "judge_agent",
)

builder.add_edge(
    "judge_agent",
    END,
)


# =========================================================
# Compile Graph
# =========================================================

graph = builder.compile(
    name="SupportOS_AI_Graph",
)