"""
=========================================================
File: qdrant_service.py

Purpose:
Handles all Qdrant database operations.

Responsibilities:
1. Store document embeddings in Qdrant
2. Search similar documents using vector search
3. Filter low-quality search results
4. Raise custom exceptions
5. Log every important operation

Data Flow

Document Upload
        │
        ▼
generate_embedding()
        │
        ▼
insert_document()
        │
        ▼
Qdrant

---------------------------------------------------------

Chat Request
        │
        ▼
generate_embedding()
        │
        ▼
search_documents()
        │
        ▼
Score Filtering
        │
        ▼
High Quality Documents
        │
        ▼
chat_service.py
=========================================================
"""

from qdrant_client.models import (
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from app.core.qdrant import qdrant
from app.core.exceptions import QdrantException
from app.core.logger import logger
from app.core.config import (
    MIN_SEARCH_SCORE,
    TOP_K_DOCUMENTS,
)

# ---------------------------------------------------------
# Qdrant Collection Name
# ---------------------------------------------------------

COLLECTION_NAME = "support_docs"


# =========================================================
# Insert Document Into Qdrant
# =========================================================

def insert_document(
    document_id: str,
    tenant_id: str,
    title: str,
    content: str,
    embedding: list[float],
):
    """
    Purpose:
        Store one document and its embedding inside Qdrant.

    Parameters
    ----------
    document_id : str
        Unique document ID.

    tenant_id : str
        Tenant identifier.

    title : str
        Document title.

    content : str
        Document content.

    embedding : list[float]
        Gemini embedding vector.

    Raises
    ------
    QdrantException
    """

    # Log insert request
    logger.info(
        f"Storing document '{title}' in Qdrant..."
    )

    try:

        # Create Qdrant point
        point = PointStruct(
            id=document_id,
            vector=embedding,
            payload={
                "tenant_id": tenant_id,
                "title": title,
                "content": content,
            },
        )

        # Store document
        qdrant.upsert(
            collection_name=COLLECTION_NAME,
            points=[point],
        )

        # Success log
        logger.info(
            "Document stored successfully in Qdrant."
        )

    except Exception as e:

        # Error log
        logger.error(
            f"Failed to store document: {str(e)}"
        )

        raise QdrantException(
            f"Failed to store document in Qdrant: {str(e)}"
        )


# =========================================================
# Search Similar Documents
# =========================================================

def search_documents(
    query_embedding: list[float],
    tenant_id: str,
    limit: int = TOP_K_DOCUMENTS,
):
    """
    Purpose:
        Search similar documents from Qdrant.

    Parameters
    ----------
    query_embedding : list[float]
        User question embedding.

    tenant_id : str
        Used for tenant isolation.

    limit : int
        Number of documents to retrieve.

    Returns
    -------
    list[dict]
        High-quality matching documents.

    Raises
    ------
    QdrantException
    """

    # Log search request
    logger.info(
        f"Searching top {limit} document(s) for tenant: {tenant_id}"
    )

    try:

        # Perform vector similarity search
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

        # Store final filtered documents
        documents = []

        # Process every matched document
        for point in results.points:

            # Skip low-quality matches
            if point.score < MIN_SEARCH_SCORE:

                logger.info(
                    f"Skipping document with low score: {round(point.score, 4)}"
                )

                continue

            # Accept good-quality matches
            logger.info(
                f"Accepted document with score: {round(point.score, 4)}"
            )

            documents.append(
                {
                    "title": point.payload["title"],
                    "content": point.payload["content"],
                    "score": round(point.score, 4),
                }
            )

        # Log final document count
        logger.info(
            f"Retrieved {len(documents)} high-quality document(s)."
        )

        # Return filtered documents
        return documents

    except Exception as e:

        # Log failure
        logger.error(
            f"Qdrant search failed: {str(e)}"
        )

        raise QdrantException(
            f"Failed to search documents: {str(e)}"
        )