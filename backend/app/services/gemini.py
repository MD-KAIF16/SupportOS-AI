from google import genai

from app.core.config import GEMINI_API_KEY

# Gemini Client
client = genai.Client(api_key=GEMINI_API_KEY)


# Generate normal text response
def ask_gemini(prompt: str) -> str:

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text


# Generate embedding vector
def get_embedding(text: str) -> list[float]:

    response = client.models.embed_content(
        model="models/gemini-embedding-001",
        contents=text,
    )

    return response.embeddings[0].values