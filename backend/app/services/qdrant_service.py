from qdrant_client.models import (
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from app.core.qdrant import qdrant

COLLECTION_NAME = "support_docs"


def insert_document(
    document_id: str,
    tenant_id: str,
    title: str,
    content: str,
    embedding: list[float],
):
    """
    Store one document vector inside Qdrant.
    """

    point = PointStruct(
        id=document_id,
        vector=embedding,
        payload={
            "tenant_id": tenant_id,
            "title": title,
            "content": content,
        },
    )

    qdrant.upsert(
        collection_name=COLLECTION_NAME,
        points=[point],
    )

    print("✅ Document Stored In Qdrant")


def search_documents(
    query_embedding: list[float],
    tenant_id: str,
    limit: int = 3,
):
    """
    Search similar documents from Qdrant.
    """

    results = qdrant.query_points(
        collection_name=COLLECTION_NAME,
        query=query_embedding,
        limit=limit,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="tenant_id",
                    match=MatchValue(value=tenant_id),
                )
            ]
        ),
    )

    documents = []

    for point in results.points:

        documents.append(
            {
                "title": point.payload["title"],
                "content": point.payload["content"],
                "score": round(point.score, 4),
            }
        )

    return documents