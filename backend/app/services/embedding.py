from google import genai
from app.core.gemini import client

from app.core.config import GEMINI_API_KEY

# Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)


def generate_embedding(text: str):
    """
    Convert text into embedding vector.
    """

    response = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text,
    )

    return response.embeddings[0].values