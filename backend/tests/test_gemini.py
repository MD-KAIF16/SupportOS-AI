import os
from dotenv import load_dotenv
from google import genai

def test_gemini_generation():
    load_dotenv()
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY")
    )
    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents="Hello Gemini! Reply in 3 words."
    )
    assert response.text is not None
    assert len(response.text) > 0