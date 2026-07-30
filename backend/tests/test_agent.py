from app.agents.graph import graph

state = {
    "messages": [],

    # User Information
    "user_id": "test-user",
    "tenant_id": "test-tenant",

    # Current Question
    "question": "What about password reset?",

    # Digital Twin
    "user_profile": {},

    # Long-Term Memory
    "conversation_history": [],

    # Knowledge Base
    "context": "",
    "documents": [],

    # Prompt
    "prompt": "",

    # AI Responses
    "draft_answer": "",
    "final_answer": "",

    # Workflow
    "next_agent": "knowledge_agent",

    # Error Handling
    "error": None,
}

result = graph.invoke(state)

print(result)