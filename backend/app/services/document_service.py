"""
document_service.py

Purpose:
Complete document upload workflow.

Flow

Receive Document
        ↓
Generate UUID
        ↓
Save in Supabase
        ↓
Generate Embedding
        ↓
Store in Qdrant
        ↓
Return Response
"""

from uuid import uuid4
from datetime import datetime, timezone

from app.models.document import SupportDocument

from app.core.supabase import supabase

from app.services.embedding import generate_embedding
from app.services.qdrant_service import insert_document


async def create_document_service(document: SupportDocument):
    """
    Upload document workflow.

    1. Generate UUID
    2. Save document in Supabase
    3. Generate embedding
    4. Store embedding in Qdrant
    """

    # Step 1 - Generate ID & Timestamp
    document_id = str(uuid4())
    created_at = datetime.now(timezone.utc).isoformat()

    # Step 2 - Save document in Supabase
    response = (
        supabase
        .table("support_documents")
        .insert({
            "id": document_id,
            "tenant_id": document.tenant_id,
            "title": document.title,
            "content": document.content,
            "created_at": created_at,
        })
        .execute()
    )

    # Step 3 - Generate embedding
    embedding = generate_embedding(
        document.content
    )

    print(f"Embedding Size: {len(embedding)}")

    # Step 4 - Store vector in Qdrant
    insert_document(
        document_id=document_id,
        tenant_id=document.tenant_id,
        title=document.title,
        content=document.content,
        embedding=embedding,
    )

    # Step 5 - Return response
    return {
        "success": True,
        "message": "Document stored successfully",
        "data": response.data,
    }