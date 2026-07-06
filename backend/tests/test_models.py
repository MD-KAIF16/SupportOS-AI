from google import genai

from app.core.config import GEMINI_API_KEY

client = genai.Client(api_key=GEMINI_API_KEY)

models = client.models.list()

for model in models:
    if "embed" in model.name.lower():
        print(model.name)