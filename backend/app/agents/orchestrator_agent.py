"""
=========================================================
File: orchestrator_agent.py

Purpose:
Workflow Controller

Responsibilities:
1. Read latest user message
2. Validate request
3. Decide next agent
4. Update shared workflow state
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from app.agents.state import SupportState
from app.core.logger import logger


# =========================================================
# Orchestrator Agent
# =========================================================

def orchestrator(
    state: SupportState,
) -> SupportState:
    """
    Entry point of LangGraph workflow.
    """

    logger.info("Orchestrator Agent Started")

    try:

        # -------------------------------------------------
        # Read Latest User Message
        # -------------------------------------------------

        last_message = state["messages"][-1]

        question = last_message.content.strip()

        if not question:

            raise ValueError(
                "Question cannot be empty."
            )

        state["question"] = question

        logger.info(
            f"Question: {question}"
        )

        # -------------------------------------------------
        # Routing Logic
        # -------------------------------------------------

        # Future:
        # FAQ -> Knowledge Agent
        # Ticket -> Ticket Agent
        # Billing -> Billing Agent

        state["next_agent"] = "knowledge_agent"

        logger.info(
            f"Next Agent: {state['next_agent']}"
        )

    except Exception as e:

        logger.exception(
            "Orchestrator failed."
        )

        state["error"] = str(e)

        state["next_agent"] = "judge_agent"

    logger.info(
        "Orchestrator Agent Finished"
    )

    return state