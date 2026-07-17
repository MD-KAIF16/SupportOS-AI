"""
=========================================================
File: gemini_service.py

Purpose:
Generate AI responses using Gemini.

Responsibilities:
1. Call Gemini client
2. Handle Gemini errors
3. Return clean AI response
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from app.core.exceptions import ChatGenerationException
from app.core.gemini_client import ask_gemini
from app.core.logger import logger


# =========================================================
# Gemini Service
# =========================================================

def generate_response(prompt: str) -> str:
    """
    Generate AI response using Gemini.

    Args:
        prompt: Final prompt sent to Gemini.

    Returns:
        AI generated response.
    """

    logger.info("Generating AI response...")

    try:

        response = ask_gemini(prompt)

        logger.info("AI response generated successfully.")

        return response.strip()

    except Exception as e:

        logger.exception(
            "Gemini response generation failed."
        )

        raise ChatGenerationException(
            f"Failed to generate AI response: {str(e)}"
        ) from e