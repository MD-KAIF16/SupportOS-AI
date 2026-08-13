import os
from dotenv import load_dotenv

load_dotenv()


def _clean_env(key: str, default: str = "") -> str:
    val = os.getenv(key, default) or ""
    return val.strip('"' "' \t\r\n")


GEMINI_API_KEY = _clean_env("GEMINI_API_KEY")
# Supabase Configuration
SUPABASE_URL = _clean_env("SUPABASE_URL").rstrip('/')
# SUPABASE_PUBLISHABLE_KEY is required for client initialization on app import
SUPABASE_PUBLISHABLE_KEY = _clean_env("SUPABASE_PUBLISHABLE_KEY")
SUPABASE_SERVICE_ROLE_KEY = _clean_env("SUPABASE_SERVICE_ROLE_KEY")
QDRANT_URL = _clean_env("QDRANT_URL")
QDRANT_API_KEY = _clean_env("QDRANT_API_KEY")

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

SECRET_KEY = _clean_env("SECRET_KEY")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60