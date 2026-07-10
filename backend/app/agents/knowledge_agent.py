from app.agents.orchestrator import SupportState


def knowledge_agent(state: SupportState):
    print("📚 Knowledge Agent Started")

    question = state["question"]

    # Abhi dummy response
    state["draft_answer"] = f"Draft answer for: {question}"

    return state