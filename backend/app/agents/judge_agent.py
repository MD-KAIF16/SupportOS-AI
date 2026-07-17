"""
=========================================================
File: judge_agent.py

Purpose:
Judge Agent

Responsibilities:
1. Read draft answer
2. Review answer
3. Improve answer (Future)
4. Save final answer
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from app.agents.state import SupportState
from app.core.logger import logger


# =========================================================
# Judge Agent
# =========================================================

def judge_agent(
    state: SupportState,
) -> SupportState:
    """
    Review AI response before returning it.
    """

    logger.info("Judge Agent Started")

    try:

        # -------------------------------------------------
        # Read Draft Answer
        # -------------------------------------------------

        draft_answer = state["draft_answer"]

        # -------------------------------------------------
        # Future Improvements
        # -------------------------------------------------
        # ✓ Hallucination Detection
        # ✓ Toxicity Check
        # ✓ Grammar Improvement
        # ✓ Response Scoring
        # ✓ Confidence Score
        # -------------------------------------------------

        final_answer = draft_answer

        state["final_answer"] = final_answer

        logger.info(
            "Final answer approved."
        )

    except Exception as e:

        logger.exception(
            "Judge Agent failed."
        )

        state["error"] = str(e)

        state["final_answer"] = (
            "I'm sorry, something went wrong while "
            "reviewing the response."
        )

    logger.info(
        "Judge Agent Finished"
    )

    return state