# Import required classes
from typing import TypedDict
from langgraph.graph import StateGraph, START, END


# State object shared between all nodes
class SupportState(TypedDict):
    question: str
    answer: str


# Node 1 - Read user question
def read_question(state: SupportState) -> SupportState:
    print(f"Question Received: {state['question']}")
    return state


# Node 2 - Validate and clean question
def validate_question(state: SupportState) -> SupportState:
    state["question"] = state["question"].strip()

    print(f"Validated Question: {state['question']}")

    return state


# Node 3 - Generate dummy answer
def generate_answer(state: SupportState) -> SupportState:
    state["answer"] = (
        f"Hello! I received your question: '{state['question']}'. "
        "Currently I am a LangGraph Agent. "
        "In the next phase I will use Gemini AI to generate intelligent responses."
    )

    return state


# Create LangGraph using SupportState
graph = StateGraph(SupportState)


# Register all nodes
graph.add_node("read_question", read_question)
graph.add_node("validate_question", validate_question)
graph.add_node("generate_answer", generate_answer)


# Connect START to first node
graph.add_edge(START, "read_question")

# Connect first node to second node
graph.add_edge("read_question", "validate_question")

# Connect second node to third node
graph.add_edge("validate_question", "generate_answer")

# Connect last node to END
graph.add_edge("generate_answer", END)


# Compile the graph
agent = graph.compile()


# Run the graph with input state
result = agent.invoke(
    {
        "question": "     Hello LangGraph           How are you doing today?     ",
        "answer": ""
    }
)


# Print final state
print(result)