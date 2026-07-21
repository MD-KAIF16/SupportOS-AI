"""
=========================================================
File: judge_agent.py

Purpose:
Judge Agent

Responsibilities:
1. Review final answer
2. Validate response
3. Improve answer (Future)
4. Return approved answer
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
    Review final AI response before returning it.
    """

    logger.info("Judge Agent Started")

    try:

        # -------------------------------------------------
        # Read Final Answer
        # -------------------------------------------------

        final_answer = state.get(
            "final_answer",
            ""
        )

        # -------------------------------------------------
        # Future Improvements
        # -------------------------------------------------
        # ✓ Hallucination Detection
        # ✓ Toxicity Check
        # ✓ Grammar Improvement
        # ✓ Response Scoring
        # ✓ Confidence Score
        # -------------------------------------------------

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