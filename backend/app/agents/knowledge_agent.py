"""
=========================================================
File: knowledge_agent.py

Purpose:
Knowledge Agent

Responsibilities:
1. Receive user question
2. Retrieve relevant documents from Qdrant
3. Build prompt using retrieved context
4. Send prompt to Gemini
5. Store draft answer in shared state
6. Save AI response into conversation memory

Day 20 Update:
- get_context() is now registered as a LangChain Tool
=========================================================
"""

# =========================================================
# Imports
# =========================================================

# Used to store AI response in conversation memory
from langchain_core.messages import AIMessage

# Used to convert a Python function into a LangChain Tool
from langchain.tools import tool

# Generate embedding for user query
from app.services.embedding import generate_embedding

# Search relevant documents from Qdrant
from app.services.qdrant_service import search_documents

# Call Gemini model
from app.services.gemini_service import ask_gemini


# =========================================================
# Tool
# =========================================================

@tool
def get_context(query: str, tenant_id: str):
    """
    LangChain Tool

    Responsibility:
    Search the knowledge base and return
    relevant documents.
    """

    print("🔍 Searching Knowledge Base...")

    # Convert question into embedding
    embedding = generate_embedding(query)

    # Search similar documents in Qdrant
    documents = search_documents(
        query_embedding=embedding,
        tenant_id=tenant_id,
    )

    return documents


# =========================================================
# Register Available Tools
# =========================================================

# Future:
# Orchestrator can dynamically choose
# which tool should be executed.
tools = [
    get_context
]


# =========================================================
# Knowledge Agent
# =========================================================

def knowledge_agent(state):

    print("\n📚 Knowledge Agent Started")

    # -----------------------------------------------------
    # Read Shared State
    # -----------------------------------------------------

    # Read tenant id
    tenant_id = state["tenant_id"]

    # Read latest user message
    question = state["messages"][-1].content

    # Save question inside shared state
    state["question"] = question

    # -----------------------------------------------------
    # Retrieve Context
    # -----------------------------------------------------

    try:

        # Execute LangChain Tool
        documents = get_context.invoke(
            {
                "query": question,
                "tenant_id": tenant_id,
            }
        )

    except Exception as e:

        print(f"❌ Context Retrieval Failed: {e}")

        documents = []

    # -----------------------------------------------------
    # Build Context
    # -----------------------------------------------------

    if documents:

        # Merge all retrieved documents
        context = "\n\n".join(
            doc["content"]
            for doc in documents
        )

    else:

        context = ""

    # Save retrieved data
    state["documents"] = documents
    state["context"] = context

    # -----------------------------------------------------
    # Build Prompt
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Ask Gemini
    # -----------------------------------------------------

    try:

        answer = ask_gemini(prompt)

    except Exception as e:

        print(f"❌ Gemini Error: {e}")

        answer = (
            "I'm sorry, I'm unable to answer right now. "
            "Please try again after some time."
        )

    # -----------------------------------------------------
    # Save Draft Answer
    # -----------------------------------------------------

    state["draft_answer"] = answer

    # -----------------------------------------------------
    # Save AI Response into Conversation Memory
    # -----------------------------------------------------

    state["messages"].append(
        AIMessage(content=answer)
    )

    print("✅ Knowledge Agent Finished")

    return state