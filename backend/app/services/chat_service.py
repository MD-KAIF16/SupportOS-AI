"""
=========================================================
File: chat_service.py

Purpose:
Execute LangGraph workflow and return AI response.
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from uuid import UUID

from langchain_core.messages import HumanMessage

from app.agents.graph import graph
from app.core.logger import logger


# =========================================================
# Chat Service
# =========================================================

def chat_with_ai(
    question: str,
    user_id: UUID,
    tenant_id: UUID,
) -> dict:
    """
    Execute LangGraph workflow and return final response.
    """

    logger.info("Starting LangGraph workflow...")

    state = {
        "messages": [
            HumanMessage(
                content=question,
            )
        ],
        "question": question,
        "user_id": str(user_id),
        "tenant_id": str(tenant_id),
        "documents": [],
        "context": "",
        "conversation_history": [],
        "user_profile": {},
        "prompt": "",
        "draft_answer": "",
        "final_answer": "",
        "next_agent": "",
        "error": None,
    }

    result = graph.invoke(state)

    logger.info("Workflow completed.")

    return {
        "reply": result["final_answer"],
        "documents": result.get("documents", []),
    }