"""
=========================================================
File: qdrant_service.py

Purpose:
Handles all Qdrant database operations.

Responsibilities:
1. Store document embeddings
2. Search similar documents
3. Filter low quality matches
4. Handle Qdrant exceptions
5. Log all important operations
=========================================================
"""

from uuid import UUID

from qdrant_client.models import (
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from app.core.qdrant_client import qdrant
from app.core.exceptions import QdrantException
from app.core.logger import logger
from app.core.config import (
    MIN_SEARCH_SCORE,
    TOP_K_DOCUMENTS,
)

# =========================================================
# Collection Name
# =========================================================

COLLECTION_NAME = "support_docs"


# =========================================================
# Insert Document
# =========================================================

def insert_document(
    document_id: UUID | str,
    tenant_id: UUID | str,
    title: str,
    content: str,
    embedding: list[float],
) -> None:
    """
    Store one document embedding inside Qdrant.
    """

    logger.info(f"Storing document '{title}' in Qdrant...")

    try:

        point = PointStruct(
            id=str(document_id),
            vector=embedding,
            payload={
                "tenant_id": str(tenant_id),
                "title": title,
                "content": content,
            },
        )

        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=[point],
        )

        logger.info("Document stored successfully in Qdrant.")

    except Exception as e:

        logger.exception("Failed to store document in Qdrant.")

        raise QdrantException(
            f"Failed to store document in Qdrant: {str(e)}"
        ) from e


# =========================================================
# Search Documents
# =========================================================

def search_documents(
    query_embedding: list[float],
    tenant_id: UUID | str,
    limit: int = TOP_K_DOCUMENTS,
) -> list[dict]:
    """
    Search similar documents using vector similarity.
    """

    logger.info(
        f"Searching top {limit} documents for tenant {tenant_id}"
    )

    try:

        results = qdrant.query_points(
            collection_name=COLLECTION_NAME,
            query=query_embedding,
            limit=limit,
            query_filter=Filter(
                must=[
                    FieldCondition(
                        key="tenant_id",
                        match=MatchValue(
                            value=str(tenant_id)
                        ),
                    )
                ]
            ),
        )

        # =====================================================
        # Debug Logs
        # =====================================================

        logger.info(f"Raw points returned: {len(results.points)}")

        for point in results.points:
            logger.info(
                f"Score={round(point.score,4)} | "
                f"Title={point.payload.get('title')}"
            )

        documents = []

        # =====================================================
        # Filter Results
        # =====================================================

        for point in results.points:

            if point.score < MIN_SEARCH_SCORE:

                logger.info(
                    f"Skipping low-score document ({round(point.score,4)})"
                )

                continue

            logger.info(
                f"Accepted document ({round(point.score,4)})"
            )

            documents.append(
                {
                    "title": point.payload["title"],
                    "content": point.payload["content"],
                    "score": round(point.score, 4),
                }
            )

        logger.info(
            f"Retrieved {len(documents)} document(s)."
        )

        return documents

    except Exception as e:

        logger.exception("Qdrant search failed.")

        raise QdrantException(
            f"Failed to search documents: {str(e)}"
        ) from e