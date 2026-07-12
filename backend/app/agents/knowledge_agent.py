"""
=========================================================
File: knowledge_agent.py

Purpose:
Knowledge Agent

Responsibilities:
1. Receive user question
2. Use Tool to retrieve context
3. Build prompt
4. Call Gemini
5. Save draft answer in shared state
6. Store AI response in conversation history
=========================================================
"""

from langchain_core.messages import AIMessage

from app.services.embedding import generate_embedding
from app.services.qdrant_service import search_documents
from app.services.gemini_service import ask_gemini


# =========================================================
# Tool
# =========================================================

def get_context(query: str, tenant_id: str):
    """
    Retrieve relevant documents from Qdrant.
    """

    print("🔍 Searching Knowledge Base...")

    embedding = generate_embedding(query)

    documents = search_documents(
        query_embedding=embedding,
        tenant_id=tenant_id,
    )

    return documents


# =========================================================
# Knowledge Agent
# =========================================================

def knowledge_agent(state):

    print("\n📚 Knowledge Agent Started")

    # -----------------------------------------
    # Read Shared State
    # -----------------------------------------

    tenant_id = state["tenant_id"]

    # Latest user message from MessagesState
    question = state["messages"][-1].content

    state["question"] = question

    # -----------------------------------------
    # Tool Call
    # -----------------------------------------

    documents = get_context(
        query=question,
        tenant_id=tenant_id,
    )

    # -----------------------------------------
    # Build Context
    # -----------------------------------------

    context = "\n\n".join(
        doc["content"]
        for doc in documents
    )

    state["documents"] = documents
    state["context"] = context

    # -----------------------------------------
    # Build Prompt
    # -----------------------------------------

    prompt = f"""
You are SupportOS AI.

Previous Conversation:
{state["messages"]}

Use ONLY the provided context to answer the user's question.

If the answer is not available in the context, reply exactly:

"I couldn't find that information in the knowledge base."

Context:
{context}

Current Question:
{question}
"""

    # -----------------------------------------
    # Generate AI Response
    # -----------------------------------------

    answer = ask_gemini(prompt)

    # Save Draft Answer
    state["draft_answer"] = answer

    # -----------------------------------------
    # Save Response in Memory
    # -----------------------------------------

    state["messages"].append(
        AIMessage(content=answer)
    )

    return state