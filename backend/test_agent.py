from app.agents.graph import graph

initial_state = {
    "question": "What is RAG?",
    "context": "",
    "draft_answer": "",
    "final_answer": ""
}

result = graph.invoke(initial_state)

print("\nFinal State:")
print(result)

print("\nFinal Answer:")
print(result["final_answer"])