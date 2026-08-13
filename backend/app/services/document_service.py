"""
=========================================================
File: document_service.py

Purpose:
Complete document upload, retrieval, and deletion workflow.
=========================================================
"""

from uuid import UUID
from app.models.document_models import SupportDocument
from app.core.logger import logger
from app.core.supabase_client import supabase
from app.core.exceptions import (
    SupabaseException,
    EmbeddingException,
    QdrantException,
)

from app.services.embedding_service import generate_embedding
from app.services.qdrant_service import insert_document, delete_document


# =========================================================
# Create Document
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
            raise SupabaseException("Document upload failed.")

        stored_document = response.data[0]
        document_id = stored_document["id"]
        logger.info("Document stored in Supabase.")

    except Exception as e:
        logger.exception("Supabase document upload failed.")
        raise SupabaseException(str(e)) from e

    try:
        embedding = generate_embedding(document.content)
        logger.info("Embedding generated successfully.")

    except Exception as e:
        logger.exception("Embedding generation failed.")
        raise EmbeddingException(str(e)) from e

    try:
        insert_document(
            document_id=document_id,
            tenant_id=str(document.tenant_id),
            title=document.title,
            content=document.content,
            embedding=embedding,
        )
        logger.info("Document stored in Qdrant.")

    except Exception as e:
        logger.exception("Qdrant insert failed.")
        raise QdrantException(str(e)) from e

    return {
        "success": True,
        "message": "Document stored successfully.",
        "data": stored_document,
    }


# =========================================================
# List Documents
# =========================================================

def list_documents_service(tenant_id: UUID | str) -> list[dict]:
    """
    Fetch all support documents belonging to a tenant.
    """
    try:
        response = (
            supabase
            .table("support_documents")
            .select("*")
            .eq("tenant_id", str(tenant_id))
            .order("created_at", desc=True)
            .execute()
        )
        return response.data or []
    except Exception as e:
        logger.exception(f"Failed to list documents for tenant {tenant_id}: {e}")
        return []


# =========================================================
# Delete Document
# =========================================================

def delete_document_service(document_id: UUID | str, tenant_id: UUID | str) -> dict:
    """
    Delete document from Supabase and Qdrant vector index.
    """
    try:
        # Verify ownership & delete from DB
        response = (
            supabase
            .table("support_documents")
            .delete()
            .eq("id", str(document_id))
            .eq("tenant_id", str(tenant_id))
            .execute()
        )

        # Delete from Qdrant vector DB
        try:
            delete_document(document_id=document_id)
        except Exception as qe:
            logger.warning(f"Qdrant vector deletion warning for document {document_id}: {qe}")

        return {
            "success": True,
            "message": "Document deleted successfully.",
        }
    except Exception as e:
        logger.exception(f"Failed to delete document {document_id}: {e}")
        raise SupabaseException(f"Failed to delete document: {str(e)}") from e