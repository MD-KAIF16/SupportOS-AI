"""
embedding.py

Purpose:
Generate embeddings using Gemini.
"""

from app.core.gemini import client
from app.core.exceptions import EmbeddingException
from app.core.logger import logger


def generate_embedding(text: str):
    """
    Convert text into embedding vector using Gemini.
    """

    logger.info("Generating embedding...")

    try:
        response = client.models.embed_content(
            model="gemini-embedding-001",
            contents=text,
        )

        logger.info("Embedding generated successfully.")

        return response.embeddings[0].values

    except Exception as e:
        logger.error(f"Embedding generation failed: {str(e)}")

        raise EmbeddingException(
            f"Failed to generate embedding: {str(e)}"
        )