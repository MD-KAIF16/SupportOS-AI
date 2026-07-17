"""
=========================================================
File: conversation_models.py

Purpose:
Conversation models for SupportOS AI.

Responsibilities:
1. Represent conversation records
2. Validate conversation data
3. Standardize conversation payloads
=========================================================
"""

from uuid import UUID
from datetime import datetime

from pydantic import BaseModel, Field


# =========================================================
# Stored Conversation
# =========================================================

class Conversation(BaseModel):
    """
    Conversation stored in Supabase.
    """

    id: UUID

    tenant_id: UUID

    user_id: UUID

    question: str = Field(
        ...,
        min_length=1,
    )

    answer: str = Field(
        ...,
        min_length=1,
    )

    created_at: datetime


# =========================================================
# Conversation History
# =========================================================

class ConversationHistory(BaseModel):
    """
    Conversation history returned by services.
    """

    conversations: list[Conversation]