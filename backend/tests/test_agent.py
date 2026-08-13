from app.agents.graph import graph
from langchain_core.messages import HumanMessage

def test_graph_execution():
    state = {
        "messages": [HumanMessage(content="What about password reset?")],
        "user_id": "test-user",
        "tenant_id": "test-tenant",
        "question": "What about password reset?",
        "user_profile": {},
        "conversation_history": [],
        "context": "",
        "documents": [],
        "prompt": "",
        "draft_answer": "",
        "final_answer": "",
        "next_agent": "knowledge_agent",
        "error": None,
    }

    result = graph.invoke(state)
    assert "final_answer" in result