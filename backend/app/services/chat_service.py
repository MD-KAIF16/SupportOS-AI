"""
chat_service.py

Purpose:
Complete RAG Pipeline

Flow

Question
    ↓
Embedding
    ↓
Qdrant Search
    ↓
Build Context
    ↓
Gemini
    ↓
Return Answer
"""

from app.core.gemini import client
from app.services.embedding import generate_embedding
from app.services.qdrant_service import search_documents


def chat_with_ai(question: str, tenant_id: str):
    """
    Generate AI response using RAG.
    """

    # Step 1 - Generate embedding
    embedding = generate_embedding(question)

    # Step 2 - Search similar documents
    documents = search_documents(
        query_embedding=embedding,
        tenant_id=tenant_id,
    )

    # Step 3 - Build context
    if documents:
        context = "\n\n".join(
            document["content"]
            for document in documents
        )
    else:
        context = "No relevant documents found."

    # Step 4 - Build prompt
    prompt = f"""
You are SupportOS AI.

Use ONLY the provided context to answer.

If the answer is not found in the context, reply:

"I couldn't find that information in the knowledge base."

Context:
{context}

Question:
{question}
"""

    # Step 5 - Gemini Response
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    # Step 6 - Return result
    return {
        "reply": response.text,
        "documents": documents,
    }