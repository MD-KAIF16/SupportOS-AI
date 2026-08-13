"""
=========================================================
File: escalation_agent.py

Purpose:
Escalation Agent

Responsibilities:
1. Handle human support escalation requests
2. Automatically create an escalated support ticket in DB
3. Provide user confirmation without exposing internal logic
=========================================================
"""

from uuid import UUID
from app.agents.state import SupportState
from app.core.logger import logger
from app.models.ticket_models import TicketCreate
from app.services.ticket_service import ticket_service


def escalation_agent(state: SupportState) -> SupportState:
    """
    Escalates user request to human support and creates a ticket.
    """
    logger.info("Escalation Agent Started")

    try:
        user_id = state["user_id"]
        tenant_id = state["tenant_id"]
        question = state.get("question", "Human Support Escalation Request")

        # Automatically create support ticket
        ticket_data = TicketCreate(
            title=f"Escalated: {question[:50]}...",
            description=f"User requested human escalation.\nFull Question: {question}",
        )

        created_ticket = ticket_service.create_ticket(
            ticket=ticket_data,
            user_id=UUID(str(user_id)),
            tenant_id=UUID(str(tenant_id)),
        )

        # Update status to Escalated
        if created_ticket and "id" in created_ticket:
            try:
                ticket_service.db.table("tickets").update({"status": "Escalated", "priority": "High"}).eq("id", created_ticket["id"]).execute()
            except Exception as ex:
                logger.warning(f"Failed to set ticket status to Escalated: {ex}")

        reply = (
            "I have escalated your request to our human support team. "
            "A high-priority support ticket has been automatically created for you, "
            "and a representative will follow up with you shortly."
        )

        state["draft_answer"] = reply
        state["final_answer"] = reply
        state["next_agent"] = "judge_agent"

        logger.info("Escalation Agent Completed Successfully.")

    except Exception as e:
        logger.exception(f"Escalation Agent failed: {e}")
        state["error"] = str(e)
        state["final_answer"] = (
            "Your request for human support has been logged. "
            "Our support team has been notified."
        )
        state["next_agent"] = "judge_agent"

    return state
