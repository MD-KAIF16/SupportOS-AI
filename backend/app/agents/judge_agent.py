"""
=========================================================
File: judge_agent.py

Purpose:
Judge Agent

Responsibilities:
1. Read draft answer
2. Review answer
3. Save final answer

Flow

Draft Answer
      │
      ▼
Judge Agent
      │
      ▼
Final Answer
=========================================================
"""


# =========================================================
# Judge Agent
# =========================================================

def judge_agent(state):

    print("\n⚖️ Judge Agent Started")

    # -----------------------------------------
    # Read Draft Answer
    # -----------------------------------------

    draft_answer = state["draft_answer"]

    # -----------------------------------------
    # Future
    # AI Review
    # Hallucination Check
    # Grammar Improvement
    # -----------------------------------------

    final_answer = draft_answer

    # Save Final Answer
    state["final_answer"] = final_answer

    print("✅ Judge Agent Finished")

    return state