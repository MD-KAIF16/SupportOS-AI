from uuid import uuid4
from app.services.qdrant_service import search_documents

def test_search_documents():
    dummy_embedding = [0.1] * 768
    tenant_id = uuid4()
    try:
        results = search_documents(
            query_embedding=dummy_embedding,
            tenant_id=tenant_id,
        )
        assert isinstance(results, list)
    except Exception as e:
        assert "Qdrant" in type(e).__name__ or "ConnectError" in str(e) or "ResponseHandlingException" in str(e)