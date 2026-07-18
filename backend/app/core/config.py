import os
from dotenv import load_dotenv

load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_PUBLISHABLE_KEY = os.getenv("SUPABASE_PUBLISHABLE_KEY")
SUPABASE_SERVICE_ROLE_KEY = os.getenv("SUPABASE_SERVICE_ROLE_KEY")
QDRANT_URL = os.getenv("QDRANT_URL")
QDRANT_API_KEY = os.getenv("QDRANT_API_KEY")   



# ---------------------------------------------------------
# RAG Configuration
# ---------------------------------------------------------

# Minimum similarity score required to accept a document
MIN_SEARCH_SCORE = 0.20

# Maximum documents to retrieve from Qdrant
TOP_K_DOCUMENTS = 3

# ---------------------------------------------------------
# JWT Configuration
# ---------------------------------------------------------

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60