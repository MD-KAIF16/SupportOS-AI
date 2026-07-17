"""
=========================================================
File: embedding_service.py

Purpose:
Generate embeddings using Gemini.

Responsibilities:
1. Convert text into embedding vector
2. Handle Gemini embedding errors
3. Return embedding for Qdrant storage
=========================================================
"""

from app.core.gemini_client import client
from app.core.exceptions import EmbeddingException
from app.core.logger import logger


def generate_embedding(text: str) -> list[float]:
    """
    Convert text into embedding vector using Gemini.

    Args:
        text: Text to embed.

    Returns:
        Embedding vector.
    """

    logger.info("Generating embedding...")

    try:
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
        )

        embedding = response.embeddings[0].values

        logger.info(
            f"Embedding generated successfully. Dimension: {len(embedding)}"
        )

        return embedding

    except Exception as e:
        logger.exception("Embedding generation failed.")

        raise EmbeddingException(
            f"Failed to generate embedding: {str(e)}"
        ) from e