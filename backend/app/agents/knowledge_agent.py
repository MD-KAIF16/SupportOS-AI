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

    # Latest User Message
    question = state["messages"][-1].content

    state["question"] = question

    # -----------------------------------------
    # Retrieve Context
    # -----------------------------------------

    try:

        documents = get_context(
            query=question,
            tenant_id=tenant_id,
        )

    except Exception as e:

        print(f"❌ Context Retrieval Failed: {e}")

        documents = []

    # -----------------------------------------
    # Build Context
    # -----------------------------------------

    if documents:

        context = "\n\n".join(
            doc["content"]
            for doc in documents
        )

    else:

        context = ""

    state["documents"] = documents
    state["context"] = context

    # -----------------------------------------
    # Build Prompt
    # -----------------------------------------

    if context:

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

    else:

        prompt = f"""
You are SupportOS AI.

Previous Conversation:
{state["messages"]}

No relevant knowledge was retrieved from the knowledge base.

If you know the answer confidently, answer briefly.

Otherwise reply:

"I couldn't find that information in the knowledge base."

Current Question:
{question}
"""

    # -----------------------------------------
    # Generate AI Response
    # -----------------------------------------

    try:

        answer = ask_gemini(prompt)

    except Exception as e:

        print(f"❌ Gemini Error: {e}")

        answer = (
            "I'm sorry, I'm unable to answer right now. "
            "Please try again after some time."
        )

    # -----------------------------------------
    # Save Draft Answer
    # -----------------------------------------

    state["draft_answer"] = answer

    # -----------------------------------------
    # Save Response in Conversation Memory
    # -----------------------------------------

    state["messages"].append(
        AIMessage(content=answer)
    )

    print("✅ Knowledge Agent Finished")

    return state