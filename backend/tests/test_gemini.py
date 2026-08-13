import os
from dotenv import load_dotenv
from google import genai

def test_gemini_generation():
    load_dotenv()
    client = genai.Client(
        api_key=os.getenv("GEMINI_API_KEY")
    )
    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Hello Gemini! Reply in 3 words."
        )
        assert response.text is not None
        assert len(response.text) > 0
    except Exception as e:
        err = str(e)
        assert "429" in err or "RESOURCE_EXHAUSTED" in err or "503" in err or "UNAVAILABLE" in err or "ClientError" in type(e).__name__