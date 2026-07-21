"""
=========================================================
File: followup_agent.py

Purpose:
Improve draft answer before sending it to Judge Agent.
=========================================================
"""

from langchain_core.messages import AIMessage

from app.agents.state import SupportState
from app.core.logger import logger


def followup_agent(
    state: SupportState,
) -> SupportState:

    logger.info("FollowUp Agent Started")

    draft = state.get("draft_answer", "")

    final_answer = (
        f"{draft}\n\n"
        "Does this solve your problem?\n\n"
        "If not, I'm happy to help you further."
    )

    state["final_answer"] = final_answer

    state["messages"].append(
        AIMessage(
            content=final_answer,
        )
    )

    state["next_agent"] = "judge_agent"

    logger.info("FollowUp Agent Finished Successfully.")

    return state