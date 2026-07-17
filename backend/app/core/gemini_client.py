"""
=========================================================
File: gemini_client.py

Purpose:
Central Gemini client for SupportOS AI.

Responsibilities:
1. Initialize Gemini client
2. Generate AI responses
3. Generate embedding vectors
=========================================================
"""

from google import genai

from app.core.config import GEMINI_API_KEY

# =========================================================
# Gemini Client
# =========================================================

client = genai.Client(
    api_key=GEMINI_API_KEY,
)


# =========================================================
# Generate AI Response
# =========================================================

def ask_gemini(prompt: str) -> str:
    """
    Generate AI response from Gemini.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text


# =========================================================
# Generate Embedding
# =========================================================

def get_embedding(text: str) -> list[float]:
    """
    Generate embedding vector using Gemini.
    """

    response = client.models.embed_content(
        model="gemini-embedding-001",
        contents=text,
    )

    return response.embeddings[0].values