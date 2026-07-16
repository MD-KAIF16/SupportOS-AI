"""
=========================================================
File: state.py

Purpose:
Shared state used across all LangGraph agents.

Responsibilities:
1. Store conversation state
2. Store user profile (Digital Twin)
3. Store retrieved context
4. Share data between agents
=========================================================
"""

from langgraph.graph import MessagesState
from pydantic import Field


# =========================================================
# Shared State
# =========================================================

class SupportState(MessagesState):
    """
    Shared workflow state for SupportOS AI.
    """

    # -----------------------------------------------------
    # User Information
    # -----------------------------------------------------

    user_id: str = ""

    tenant_id: str = ""

    # -----------------------------------------------------
    # User Question
    # -----------------------------------------------------

    question: str = ""

    # -----------------------------------------------------
    # Digital Twin
    # -----------------------------------------------------

    user_profile: dict = Field(
        default_factory=dict
    )

    # -----------------------------------------------------
    # Knowledge Base
    # -----------------------------------------------------

    context: str = ""

    documents: list = Field(
        default_factory=list
    )

    # -----------------------------------------------------
    # AI Responses
    # -----------------------------------------------------

    draft_answer: str = ""

    final_answer: str = ""

    # -----------------------------------------------------
    # Workflow
    # -----------------------------------------------------

    next_agent: str = "knowledge_agent"