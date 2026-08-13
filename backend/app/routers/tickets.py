"""
=========================================================
File: tickets.py

Purpose:
Ticket API endpoints.

Responsibilities:
1. Create Ticket
2. Get User Tickets
=========================================================
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status

from app.auth.dependencies import get_current_user
from app.models.ticket_models import TicketCreate
from app.services.ticket_service import ticket_service

router = APIRouter(
    prefix="/tickets",
    tags=["Tickets"],
)


# =====================================================
# Create Ticket
# =====================================================

@router.post(
    "/",
    status_code=status.HTTP_201_CREATED,
)
def create_ticket(
    ticket: TicketCreate,
    current_user: dict = Depends(get_current_user),
):
    """
    Create a new support ticket.
    """

    try:

        created_ticket = ticket_service.create_ticket(
            ticket=ticket,
            user_id=UUID(current_user["id"]),          # ✅ FIXED
            tenant_id=UUID(current_user["tenant_id"]),
        )

        return {
            "message": "Ticket created successfully.",
            "ticket": created_ticket,
        }

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create ticket: {str(e)}",
        )


# =====================================================
# Get My Tickets
# =====================================================

@router.get("/")
def get_my_tickets(
    current_user: dict = Depends(get_current_user),
):
    """
    Get support tickets for the current user session.
    Admin roles view all tenant tickets; customer roles view own tickets only.
    """

    try:
        user_role = current_user.get("role", "").lower()
        tenant_id = UUID(current_user["tenant_id"])

        if user_role == "admin":
            tickets = ticket_service.get_tenant_tickets(tenant_id=tenant_id)
        else:
            tickets = ticket_service.get_user_tickets(
                user_id=UUID(current_user["id"]),
                tenant_id=tenant_id,
            )

        return {
            "count": len(tickets),
            "tickets": tickets,
        }

    except Exception as e:

        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch tickets: {str(e)}",
        )