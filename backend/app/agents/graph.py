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

Future Flow

START
   │
   ▼
Orchestrator
   │
   ├──────────────► Knowledge Agent
   │
   ├──────────────► Order Agent
   │
   ├──────────────► Billing Agent
   │
   └──────────────► Escalation Agent
=========================================================
"""

from langgraph.graph import (
    StateGraph,
    START,
    END,
)

from app.agents.orchestrator import (
    SupportState,
    orchestrator,
)

from app.agents.knowledge_agent import knowledge_agent
from app.agents.judge_agent import judge_agent


# =========================================================
# Create Workflow Builder
# =========================================================

builder = StateGraph(SupportState)


# =========================================================
# Register Agents
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
# Workflow
# =========================================================

# Workflow Start
builder.add_edge(
    START,
    "orchestrator",
)

# Current Routing
# Future:
# builder.add_conditional_edges(...)
builder.add_edge(
    "orchestrator",
    "knowledge_agent",
)

# Knowledge -> Judge
builder.add_edge(
    "knowledge_agent",
    "judge_agent",
)

# Finish Workflow
builder.add_edge(
    "judge_agent",
    END,
)


# =========================================================
# Compile Graph
# =========================================================

graph = builder.compile()