"""
=========================================================
File: conversation_service.py

Purpose:
Manage conversation history.

Responsibilities:
1. Retrieve recent conversations
2. Save new conversations
3. Support long-term memory
4. Tenant isolation
=========================================================
"""

from uuid import UUID

from supabase import Client

from app.core.logger import logger
from app.core.supabase_client import supabase


class ConversationService:
    """
    Service responsible for managing conversation history.
    """

    def __init__(self, db: Client = supabase):
        self.db = db

    # =====================================================
    # Get Recent Conversations
    # =====================================================

    def get_recent_conversations(
        self,
        user_id: UUID,
        tenant_id: UUID,
        limit: int = 5,
    ) -> list[dict]:

        try:

            response = (
                self.db
                .table("conversations")
                .select("*")
                .eq("user_id", str(user_id))
                .eq("tenant_id", str(tenant_id))
                .order("created_at", desc=True)
                .limit(limit)
                .execute()
            )

            logger.info(
                f"Loaded {len(response.data)} conversation(s)."
            )

            return response.data or []

        except Exception as e:

            logger.exception(
                f"Failed to fetch conversations: {e}"
            )

            return []

    # =====================================================
    # Save Conversation
    # =====================================================

    def save_conversation(
        self,
        user_id: UUID,
        tenant_id: UUID,
        question: str,
        answer: str,
    ) -> None:

        try:

            (
                self.db
                .table("conversations")
                .insert(
                    {
                        "user_id": str(user_id),
                        "tenant_id": str(tenant_id),
                        "question": question,
                        "answer": answer,
                    }
                )
                .execute()
            )

            logger.info("Conversation saved successfully.")

        except Exception as e:

            logger.exception(
                f"Failed to save conversation: {e}"
            )


conversation_service = ConversationService()