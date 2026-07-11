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

Flow

Question
    │
    ▼
Tool (get_context)
    │
    ▼
Qdrant Search
    │
    ▼
Documents
    │
    ▼
Context
    │
    ▼
Prompt
    │
    ▼
Gemini
    │
    ▼
Draft Answer
=========================================================
"""

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

    # Generate embedding for user query
    embedding = generate_embedding(query)

    # Search similar documents
    documents = search_documents(
        query_embedding=embedding,
        tenant_id=tenant_id,
    )

    return documents


# =========================================================
# Knowledge Agent
# =========================================================

def knowledge_agent(state):

    print("📚 Knowledge Agent Started")

    # -----------------------------------------
    # Read Shared State
    # -----------------------------------------

    question = state["question"]
    tenant_id = state["tenant_id"]

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

    # Save context and documents
    state["documents"] = documents
    state["context"] = context

    # -----------------------------------------
    # Build Prompt
    # -----------------------------------------

    prompt = f"""
You are SupportOS AI.

Use ONLY the provided context to answer the user's question.

If the answer is not available in the context, reply exactly:

"I couldn't find that information in the knowledge base."

Context:
{context}

Question:
{question}
"""

    # -----------------------------------------
    # Generate AI Response
    # -----------------------------------------

    answer = ask_gemini(prompt)

    # Save draft answer
    state["draft_answer"] = answer

    return state