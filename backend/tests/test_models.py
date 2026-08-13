from google import genai
from app.core.config import GEMINI_API_KEY

def test_gemini_models_list():
    client = genai.Client(api_key=GEMINI_API_KEY)
    models = list(client.models.list())
    assert len(models) > 0