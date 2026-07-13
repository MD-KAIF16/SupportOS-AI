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

Day 19 Improvements
-------------------
✓ Embedding Error Handling
✓ Qdrant Error Handling
✓ Empty Retrieval Fallback
✓ Gemini Error Handling
✓ Graceful Degradation
=========================================================
"""

from app.core.gemini import client
from app.core.logger import logger

from app.services.embedding import generate_embedding
from app.services.qdrant_service import search_documents


# =========================================================
# Chat With AI
# =========================================================

def chat_with_ai(question: str, tenant_id: str):
    """
    Generate AI response using Retrieval-Augmented Generation (RAG).
    """

    logger.info(
        f"New chat request received for tenant: {tenant_id}"
    )

    # -----------------------------------------------------
    # Step 1 - Generate Embedding
    # -----------------------------------------------------

    try:

        logger.info("Generating embedding...")

        embedding = generate_embedding(question)

    except Exception as e:

        logger.error(
            f"Embedding Generation Failed: {str(e)}"
        )

        return {
            "reply": (
                "I'm sorry, I couldn't process your question. "
                "Please try again."
            ),
            "documents": [],
        }

    # -----------------------------------------------------
    # Step 2 - Search Documents
    # -----------------------------------------------------

    try:

        logger.info("Searching relevant documents...")

        documents = search_documents(
            query_embedding=embedding,
            tenant_id=tenant_id,
        )

    except Exception as e:

        logger.error(
            f"Qdrant Search Failed: {str(e)}"
        )

        documents = []

    # -----------------------------------------------------
    # Step 3 - Build Context
    # -----------------------------------------------------

    if documents:

        logger.info(
            f"{len(documents)} document(s) retrieved."
        )

        context = "\n\n".join(
            document["content"]
            for document in documents
        )

    else:

        logger.warning(
            "No relevant documents found. Using fallback."
        )

        context = ""

    # -----------------------------------------------------
    # Step 4 - Build Prompt
    # -----------------------------------------------------

    if context:

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

    else:

        prompt = f"""
You are SupportOS AI.

No relevant documents were found in the knowledge base.

If you know the answer confidently,
answer briefly.

Otherwise reply:

"I couldn't find that information in the knowledge base."

Question:
{question}
"""

    # -----------------------------------------------------
    # Step 5 - Generate AI Response
    # -----------------------------------------------------

    try:

        logger.info("Generating AI response...")

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        logger.info(
            "AI response generated successfully."
        )

        reply = response.text

    except Exception as e:

        logger.error(
            f"Gemini Generation Failed: {str(e)}"
        )

        reply = (
            "I'm sorry, I'm unable to answer right now. "
            "Please try again after some time."
        )

    # -----------------------------------------------------
    # Step 6 - Return Response
    # -----------------------------------------------------

    logger.info("Returning chat response.")

    return {
        "reply": reply,
        "documents": documents,
    }