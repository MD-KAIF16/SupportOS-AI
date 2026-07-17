"""
=========================================================
File: document_service.py

Purpose:
Complete document upload workflow.

Flow

Receive Document
        ↓
Save in Supabase
        ↓
Generate Embedding
        ↓
Store in Qdrant
        ↓
Return Response
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from app.models.document_models import SupportDocument

from app.core.logger import logger
from app.core.supabase_client import supabase
from app.core.exceptions import (
    SupabaseException,
    EmbeddingException,
    QdrantException,
)

from app.services.embedding_service import generate_embedding
from app.services.qdrant_service import insert_document


# =========================================================
# Document Service
# =========================================================

async def create_document_service(
    document: SupportDocument,
):
    """
    Upload document workflow.

    1. Save document in Supabase
    2. Generate embedding
    3. Store embedding in Qdrant
    """

    logger.info("Starting document upload workflow...")

    try:

        # -------------------------------------------------
        # Save in Supabase
        # -------------------------------------------------

        response = (
            supabase
            .table("support_documents")
            .insert(
                {
                    "tenant_id": str(document.tenant_id),
                    "title": document.title,
                    "content": document.content,
                }
            )
            .execute()
        )

        if not response.data:
            raise SupabaseException(
                "Document upload failed."
            )

        stored_document = response.data[0]

        document_id = stored_document["id"]

        logger.info(
            "Document stored in Supabase."
        )

    except Exception as e:

        logger.exception(
            "Supabase document upload failed."
        )

        raise SupabaseException(
            str(e)
        ) from e

    try:

        # -------------------------------------------------
        # Generate Embedding
        # -------------------------------------------------

        embedding = generate_embedding(
            document.content
        )

        logger.info(
            "Embedding generated successfully."
        )

    except Exception as e:

        logger.exception(
            "Embedding generation failed."
        )

        raise EmbeddingException(
            str(e)
        ) from e

    try:

        # -------------------------------------------------
        # Store in Qdrant
        # -------------------------------------------------

        insert_document(
            document_id=document_id,
            tenant_id=str(document.tenant_id),
            title=document.title,
            content=document.content,
            embedding=embedding,
        )

        logger.info(
            "Document stored in Qdrant."
        )

    except Exception as e:

        logger.exception(
            "Qdrant insert failed."
        )

        raise QdrantException(
            str(e)
        ) from e

    # -----------------------------------------------------
    # Return Response
    # -----------------------------------------------------

    logger.info(
        "Document upload workflow completed."
    )

    return {
        "success": True,
        "message": "Document stored successfully.",
        "data": stored_document,
    }