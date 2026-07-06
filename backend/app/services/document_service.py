from app.models.document import SupportDocument

from app.core.supabase import supabase

from app.services.embedding import generate_embedding
from app.services.qdrant_service import insert_document


async def create_document_service(document: SupportDocument):
    """
    Upload document workflow.

    1. Save document in Supabase
    2. Generate embedding
    3. Store embedding in Qdrant
    """

    # -----------------------------
    # Step 1 : Save original document
    # -----------------------------
    response = (
        supabase
        .table("support_documents")
        .insert({
            "id": str(document.id),
            "tenant_id": str(document.tenant_id),
            "title": document.title,
            "content": document.content,
            "created_at": document.created_at.isoformat(),
        })
        .execute()
    )

    # -----------------------------
    # Step 2 : Generate embedding
    # -----------------------------
    embedding = generate_embedding(
        document.content
    )

    print(f"Embedding Size : {len(embedding)}")

    # -----------------------------
    # Step 3 : Store vector in Qdrant
    # -----------------------------
    insert_document(
        document_id=str(document.id),
        tenant_id=str(document.tenant_id),
        title=document.title,
        content=document.content,
        embedding=embedding,
    )

    # -----------------------------
    # Step 4 : Return response
    # -----------------------------
    return {
        "success": True,
        "message": "Document stored successfully",
        "data": response.data,
    }