from langgraph.graph import StateGraph, START, END

from app.agents.orchestrator import SupportState, orchestrator
from app.agents.knowledge_agent import knowledge_agent
from app.agents.judge_agent import judge_agent


builder = StateGraph(SupportState)

builder.add_node("orchestrator", orchestrator)
builder.add_node("knowledge_agent", knowledge_agent)
builder.add_node("judge_agent", judge_agent)

builder.add_edge(START, "orchestrator")
builder.add_edge("orchestrator", "knowledge_agent")
builder.add_edge("knowledge_agent", "judge_agent")
builder.add_edge("judge_agent", END)

graph = builder.compile()