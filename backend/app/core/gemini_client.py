"""
=========================================================
File: gemini_client.py

Purpose:
Central Gemini client for SupportOS AI with exponential backoff retry and safe error handling.

Responsibilities:
1. Initialize Gemini client
2. Generate AI responses with retries on transient errors
3. Generate embedding vectors
=========================================================
"""

from google import genai
from google.genai.errors import ServerError
from tenacity import retry, stop_after_attempt, wait_exponential, retry_if_exception_type

from app.core.config import GEMINI_API_KEY
from app.core.logger import logger

# =========================================================
# Gemini Client Initialization
# =========================================================

client = genai.Client(
    api_key=GEMINI_API_KEY,
)


# =========================================================
# Generate AI Response
# =========================================================

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1.5, min=2, max=8),
    retry=retry_if_exception_type(ServerError),
    reraise=True,
)
def ask_gemini(prompt: str) -> str:
    """
    Generate AI response from Gemini using gemini-2.5-flash.
    Includes automated retries for transient 503 server errors.
    """
    logger.info("[CHAT] Gemini request started (model: gemini-2.5-flash)")

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
        )

        if not response or not response.text:
            logger.warning("[CHAT] Gemini response returned empty text payload.")
            return "I couldn't find that information in the knowledge base."

        logger.info("[CHAT] Gemini response received successfully.")
        return response.text

    except Exception as e:
        err_msg = str(e)
        if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
            logger.warning("[CHAT] Gemini request failed: Rate limit / Quota exceeded (429).")
        elif "503" in err_msg or "UNAVAILABLE" in err_msg:
            logger.warning("[CHAT] Gemini request failed: High demand / Service unavailable (503).")
        else:
            logger.error(f"[CHAT] Gemini request failed: {type(e).__name__}")
        raise


# =========================================================
# Generate Embedding
# =========================================================

@retry(
    stop=stop_after_attempt(3),
    wait=wait_exponential(multiplier=1.5, min=2, max=8),
    retry=retry_if_exception_type(ServerError),
    reraise=True,
)
def get_embedding(text: str) -> list[float]:
    """
    Generate embedding vector using gemini-embedding-001.
    """
    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )

    return response.embeddings[0].values