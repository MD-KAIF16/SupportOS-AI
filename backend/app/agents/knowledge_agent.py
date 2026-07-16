"""
=========================================================
File: knowledge_agent.py

Purpose:
Knowledge Agent

Responsibilities:
1. Receive user question
2. Load User Digital Twin
3. Retrieve relevant documents from Qdrant
4. Build personalized prompt
5. Send prompt to Gemini
6. Store draft answer
7. Save AI response into memory
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from langchain_core.messages import AIMessage
from langchain.tools import tool

from app.services.profile_service import get_profile
from app.services.embedding import generate_embedding
from app.services.qdrant_service import search_documents
from app.services.gemini_service import ask_gemini


# =========================================================
# Tool
# =========================================================

@tool
def get_context(query: str, tenant_id: str):
    """
    Search Qdrant Knowledge Base.
    """

    print("🔍 Searching Knowledge Base...")

    embedding = generate_embedding(query)

    documents = search_documents(
        query_embedding=embedding,
        tenant_id=tenant_id,
    )

    return documents


# =========================================================
# Register Tools
# =========================================================

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

    tenant_id = state["tenant_id"]
    user_id = state["user_id"]

    question = state["messages"][-1].content

    state["question"] = question

    # -----------------------------------------------------
    # Load User Profile
    # -----------------------------------------------------

    try:

        profile = get_profile(user_id)

    except Exception as e:

        print(f"❌ Profile Load Error: {e}")

        profile = {}

    state["user_profile"] = profile

    # -----------------------------------------------------
    # Retrieve Context
    # -----------------------------------------------------

    try:

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

        context = "\n\n".join(
            doc["content"]
            for doc in documents
        )

    else:

        context = ""

    state["documents"] = documents
    state["context"] = context

    # -----------------------------------------------------
    # User Profile Context
    # -----------------------------------------------------

    profile_context = ""

    if profile:

        profile_context = f"""
User Profile

Name: {profile.get("full_name", "Unknown")}
Company: {profile.get("company", "Unknown")}
Preferred Language: {profile.get("preferred_language", "English")}
Preferred Tone: {profile.get("preferred_tone", "Friendly")}
"""

    # -----------------------------------------------------
    # Build Prompt
    # -----------------------------------------------------

    if context:

        prompt = f"""
You are SupportOS AI.

{profile_context}

Previous Conversation:
{state["messages"]}

Use ONLY the provided context to answer the user's question.

If the answer is not available in the context, reply exactly:

"I couldn't find that information in the knowledge base."

Context:
{context}

Current Question:
{question}

Answer according to the user's preferred language and preferred tone.
"""

    else:

        prompt = f"""
You are SupportOS AI.

{profile_context}

Previous Conversation:
{state["messages"]}

No relevant knowledge was retrieved from the knowledge base.

If you know the answer confidently, answer briefly.

Otherwise reply:

"I couldn't find that information in the knowledge base."

Current Question:
{question}

Answer according to the user's preferred language and preferred tone.
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
    # Save AI Response into Memory
    # -----------------------------------------------------

    state["messages"].append(
        AIMessage(content=answer)
    )

    print("✅ Knowledge Agent Finished")

    return state