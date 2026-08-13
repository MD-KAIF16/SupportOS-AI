from qdrant_client import QdrantClient

from app.core.config import (
    QDRANT_URL,
    QDRANT_API_KEY,
)

# Create one Qdrant client for whole project
qdrant = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
    timeout=60.0,
    check_compatibility=False,
)