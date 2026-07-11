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

    print("⚖️ Judge Agent Started")

    # -----------------------------------------
    # Read Draft Answer
    # -----------------------------------------

    draft_answer = state["draft_answer"]

    # -----------------------------------------
    # Day 17
    # Future me yaha AI review hoga
    # Hallucination check
    # Fact checking
    # Grammar improvement
    # -----------------------------------------

    final_answer = draft_answer

    # Save Final Answer
    state["final_answer"] = final_answer

    return state