from app.core.qdrant_client import qdrant

collections = qdrant.get_collections()

print(collections)