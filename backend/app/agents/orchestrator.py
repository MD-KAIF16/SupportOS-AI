from typing import TypedDict


class SupportState(TypedDict):
    question: str
    context: str
    draft_answer: str
    final_answer: str


def orchestrator(state: SupportState):
    print("📌 Orchestrator Agent Started")
    print(f"Question: {state['question']}")

    return state