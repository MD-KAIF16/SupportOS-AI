from app.core.qdrant import qdrant

collections = qdrant.get_collections()

print(collections)