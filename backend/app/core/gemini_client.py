"""
=========================================================
File: gemini_client.py

Purpose:
Central Gemini client for SupportOS AI with multi-model fallback and safe error handling.

Responsibilities:
1. Initialize Gemini client
2. Generate AI responses with automated fallback for quota/rate limits
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

# Active production models with available quota
PREFERRED_MODELS = [
    "gemini-flash-latest",
    "gemini-flash-lite-latest",
    "gemini-2.5-flash",
]


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
    Generate AI response from Gemini with multi-model quota fallback.
    """
    last_exception = None

    for model_name in PREFERRED_MODELS:
        logger.info(f"[CHAT] Requesting Gemini generation (model: {model_name})")
        try:
            response = client.models.generate_content(
                model=model_name,
                contents=prompt,
            )

            if response and response.text:
                logger.info(f"[CHAT] Gemini response received successfully from model: {model_name}")
                return response.text
            else:
                logger.warning(f"[CHAT] Gemini model {model_name} returned empty text payload.")
        except Exception as e:
            err_msg = str(e)
            last_exception = e
            if "429" in err_msg or "RESOURCE_EXHAUSTED" in err_msg:
                logger.warning(f"[CHAT] Model {model_name} failed: Quota/Rate Limit (429). Attempting fallback model...")
            elif "503" in err_msg or "UNAVAILABLE" in err_msg:
                logger.warning(f"[CHAT] Model {model_name} failed: High Demand (503). Attempting fallback model...")
            else:
                logger.error(f"[CHAT] Model {model_name} failed: {type(e).__name__}. Attempting fallback model...")

    if last_exception:
        raise last_exception

    return "I couldn't find that information in the knowledge base."


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