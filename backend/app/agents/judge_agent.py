from app.agents.orchestrator import SupportState


def judge_agent(state: SupportState):
    print("⚖️ Judge Agent Started")

    draft = state["draft_answer"]

    # Abhi dummy review
    state["final_answer"] = draft + " (Reviewed)"

    return state