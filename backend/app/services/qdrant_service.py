"""
=========================================================
File: qdrant_service.py

Purpose:
Handles all Qdrant database operations.

Responsibilities:
1. Store document embeddings
2. Search similar documents
3. Filter low quality matches
4. Delete points on document removal
5. Handle Qdrant exceptions
6. Log all important operations
=========================================================
"""

from uuid import UUID

from qdrant_client.models import (
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
    PointIdsList,
    VectorParams,
    Distance,
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


def ensure_collection_exists(vector_size: int = 768) -> None:
    """
    Ensure Qdrant collection exists before inserting/searching.
    """
    try:
        if not qdrant.collection_exists(COLLECTION_NAME):
            logger.info(f"Creating Qdrant collection '{COLLECTION_NAME}'...")
            qdrant.create_collection(
                collection_name=COLLECTION_NAME,
                vectors_config=VectorParams(
                    size=vector_size,
                    distance=Distance.COSINE,
                ),
            )
            logger.info(f"Collection '{COLLECTION_NAME}' created successfully.")
    except Exception as e:
        logger.warning(f"Failed to verify/create Qdrant collection: {e}")



# =========================================================
# Insert Document
# =========================================================

import time

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

    last_exc = None
    for attempt in range(1, 4):
        try:
            ensure_collection_exists(len(embedding))

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
            return

        except Exception as e:
            last_exc = e
            logger.warning(f"Qdrant insert attempt {attempt} failed: {e}")
            time.sleep(1)

    logger.exception("Failed to store document in Qdrant after retries.")
    raise QdrantException(
        f"Failed to store document in Qdrant: {str(last_exc)}"
    ) from last_exc



# =========================================================
# Delete Document
# =========================================================

def delete_document(
    document_id: UUID | str,
) -> None:
    """
    Delete document vector point from Qdrant.
    """

    logger.info(f"Deleting document point {document_id} from Qdrant...")

    last_exc = None
    for attempt in range(1, 4):
        try:
            qdrant.delete(
                collection_name=COLLECTION_NAME,
                points_selector=PointIdsList(
                    points=[str(document_id)]
                ),
            )
            logger.info("Document deleted successfully from Qdrant.")
            return
        except Exception as e:
            last_exc = e
            logger.warning(f"Qdrant delete attempt {attempt} failed: {e}")
            time.sleep(1)

    logger.exception("Failed to delete document from Qdrant after retries.")
    raise QdrantException(
        f"Failed to delete document from Qdrant: {str(last_exc)}"
    ) from last_exc


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

    last_exc = None
    for attempt in range(1, 4):
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

            logger.info(f"Raw points returned: {len(results.points)}")

            for point in results.points:
                logger.info(
                    f"Score={round(point.score,4)} | "
                    f"Title={point.payload.get('title')}"
                )

            documents = []

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
            last_exc = e
            logger.warning(f"Qdrant search attempt {attempt} failed: {e}")
            time.sleep(1)

    logger.exception("Qdrant search failed after retries.")
    raise QdrantException(
        f"Failed to search documents: {str(last_exc)}"
    ) from last_exc