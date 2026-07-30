"""
tests/test_search.py
"""

from app.services.qdrant_service import search_documents

# Dummy embedding (3072 values if Gemini embedding model uses 3072)
dummy_embedding = [0.1] * 3072

results = search_documents(
    query_embedding=dummy_embedding,
    tenant_id="tenant_1",
)

print(results)