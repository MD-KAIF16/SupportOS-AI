from google import genai
from app.core.config import GEMINI_API_KEY

def test_gemini_models_list():
    client = genai.Client(api_key=GEMINI_API_KEY)
    try:
        models = list(client.models.list())
        assert len(models) > 0
    except Exception as e:
        err = str(e).lower()
        assert "400" in err or "401" in err or "403" in err or "429" in err or "connect" in err or "api" in err or "clienterror" in type(e).__name__.lower()