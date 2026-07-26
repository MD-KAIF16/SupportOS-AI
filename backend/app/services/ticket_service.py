"""
=========================================================
File: ticket_service.py

Purpose:
Manage support tickets.

Responsibilities:
1. Create ticket
2. Get user tickets
3. Update ticket (future)
4. Delete ticket (future)
=========================================================
"""

from uuid import UUID

from supabase import Client

from app.core.logger import logger
from app.core.supabase_client import supabase
from app.models.ticket_models import TicketCreate


class TicketService:

    def __init__(self, db: Client = supabase):
        self.db = db

    # =====================================================
    # Create Ticket
    # =====================================================

    def create_ticket(
        self,
        ticket: TicketCreate,
        user_id: UUID,
        tenant_id: UUID,
    ) -> dict:

        try:

            response = (
                self.db
                .table("tickets")
                .insert(
                    {
                        "user_id": str(user_id),
                        "tenant_id": str(tenant_id),
                        "title": ticket.title,
                        "description": ticket.description,
                        "status": "Open",
                        "priority": "Medium",
                    }
                )
                .execute()
            )

            logger.info("Ticket created successfully.")

            return response.data[0]

        except Exception as e:

            logger.exception(
                f"Failed to create ticket: {e}"
            )

            raise

    # =====================================================
    # Get Tickets
    # =====================================================

    def get_user_tickets(
        self,
        user_id: UUID,
        tenant_id: UUID,
    ) -> list[dict]:

        try:

            response = (
                self.db
                .table("tickets")
                .select("*")
                .eq("user_id", str(user_id))
                .eq("tenant_id", str(tenant_id))
                .order("created_at", desc=True)
                .execute()
            )

            return response.data or []

        except Exception as e:

            logger.exception(
                f"Failed to fetch tickets: {e}"
            )

            return []


ticket_service = TicketService()