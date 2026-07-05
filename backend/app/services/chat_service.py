"""
chat_service.py

Purpose
-------
Contains the business logic for the chatbot.

Flow
----
User Question
      ↓
Qdrant Search
      ↓
Filter Relevant Documents
      ↓
Build Context
      ↓
Build Prompt
      ↓
Gemini
      ↓
Final Reply
"""

from app.services.gemini_service import ask_gemini
from app.services.qdrant_service import search_documents


def generate_reply(message: str) -> str:
    """
    Generate an AI response using RAG.
    """

    try:

        # Search relevant documents from Qdrant
        documents = search_documents(
            query=message,
            tenant_id="tenant_1",
        )

        # Keep only high-confidence documents
        relevant_docs = [
            doc["text"]
            for doc in documents
            if doc["score"] >= 0.70
        ]

        # No relevant documents found
        if not relevant_docs:
            return (
                "I couldn't find this information "
                "in the knowledge base."
            )

        # Convert documents into a single context
        context = "\n\n".join(relevant_docs)

        # Build the RAG prompt
        prompt = f"""
You are an AI Customer Support Assistant.

Answer ONLY using the provided context.

If the answer is not available in the context,
reply exactly:

"I couldn't find this information in the knowledge base."

Never make up information.

Context:
{context}

Question:
{message}
"""

        # Generate response using Gemini
        reply = ask_gemini(prompt)

        return reply

    except Exception as e:

        print(f"[Gemini Error] {e}")

        return (
            "Sorry! I'm unable to generate a response right now. "
            "Please try again in a moment."
        )