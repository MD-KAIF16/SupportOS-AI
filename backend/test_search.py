from app.services.qdrant_service import search_documents

results = search_documents(
    "I forgot my password"
)

for point in results:
    print(point.payload["text"])