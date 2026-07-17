"""
=========================================================
File: state.py

Purpose:
Shared workflow state for SupportOS AI.

Responsibilities:
1. Share data across LangGraph agents
2. Store Digital Twin
3. Store conversation memory
4. Store retrieved knowledge
5. Store AI responses
=========================================================
"""

from uuid import UUID

from langgraph.graph import MessagesState
from pydantic import Field


class SupportState(MessagesState):
    """
    Shared workflow state.
    """

    # =====================================================
    # User Information
    # =====================================================

    user_id: UUID | str

    tenant_id: UUID | str

    # =====================================================
    # Current Question
    # =====================================================

    question: str = ""

    # =====================================================
    # Digital Twin
    # =====================================================

    user_profile: dict = Field(default_factory=dict)

    # =====================================================
    # Long-Term Memory
    # =====================================================

    conversation_history: list[dict] = Field(default_factory=list)

    # =====================================================
    # Knowledge Base
    # =====================================================

    context: str = ""

    documents: list[dict] = Field(default_factory=list)

    # =====================================================
    # Prompt
    # =====================================================

    prompt: str = ""

    # =====================================================
    # AI Responses
    # =====================================================

    draft_answer: str = ""

    final_answer: str = ""

    # =====================================================
    # Workflow
    # =====================================================

    next_agent: str = "knowledge_agent"

    # =====================================================
    # Error Handling
    # =====================================================

    error: str | None = None