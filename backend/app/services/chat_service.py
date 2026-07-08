"""
=========================================================
File: chat_service.py

Purpose:
Complete Retrieval-Augmented Generation (RAG) Pipeline.

Responsibilities:
1. Generate embedding from user question
2. Search relevant documents from Qdrant
3. Build context
4. Create Gemini prompt
5. Generate AI response
6. Return final response

Data Flow

User Question
        │
        ▼
Generate Embedding
        │
        ▼
Search Qdrant
        │
        ▼
Relevant Documents
        │
        ▼
Build Context
        │
        ▼
Gemini Prompt
        │
        ▼
Generate Response
        │
        ▼
Frontend
=========================================================
"""

from app.core.gemini import client
from app.core.logger import logger

from app.services.embedding import generate_embedding
from app.services.qdrant_service import search_documents

from app.core.exceptions import (
    ChatGenerationException,
    DocumentNotFoundException,
)


# =========================================================
# Chat With AI
# =========================================================

def chat_with_ai(question: str, tenant_id: str):
    """
    Purpose:
        Generate AI response using Retrieval-Augmented Generation.

    Parameters
    ----------
    question : str
        User's question.

    tenant_id : str
        Tenant identifier used for document isolation.

    Returns
    -------
    dict
        {
            "reply": AI Generated Response,
            "documents": Retrieved Documents
        }

    Raises
    ------
    DocumentNotFoundException
    ChatGenerationException
    """

    # -----------------------------------------------------
    # Log incoming request
    # -----------------------------------------------------

    logger.info(
        f"New chat request received for tenant: {tenant_id}"
    )

    # -----------------------------------------------------
    # Step 1 - Generate Embedding
    # -----------------------------------------------------

    logger.info("Generating embedding...")

    embedding = generate_embedding(question)

    # -----------------------------------------------------
    # Step 2 - Search Similar Documents
    # -----------------------------------------------------

    logger.info("Searching relevant documents...")

    documents = search_documents(
        query_embedding=embedding,
        tenant_id=tenant_id,
    )

    # -----------------------------------------------------
    # Step 3 - Handle Empty Retrieval
    # -----------------------------------------------------

    if not documents:

        logger.warning(
            "No relevant documents found."
        )

        raise DocumentNotFoundException(
            "No relevant documents found."
        )

    # -----------------------------------------------------
    # Step 4 - Build Context
    # -----------------------------------------------------

    logger.info("Building prompt context...")

    context = "\n\n".join(
        document["content"]
        for document in documents
    )

    # -----------------------------------------------------
    # Step 5 - Build Prompt
    # -----------------------------------------------------

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

    # -----------------------------------------------------
    # Step 6 - Generate AI Response
    # -----------------------------------------------------

    logger.info("Generating AI response...")

    try:

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        logger.info(
            "AI response generated successfully."
        )

    except Exception as e:

        logger.error(
            f"Gemini generation failed: {str(e)}"
        )

        raise ChatGenerationException(
            f"Failed to generate response: {str(e)}"
        )

    # -----------------------------------------------------
    # Step 7 - Return Final Response
    # -----------------------------------------------------

    logger.info("Returning chat response.")

    return {
        "reply": response.text,
        "documents": documents,
    }