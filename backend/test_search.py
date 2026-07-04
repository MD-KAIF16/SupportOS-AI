from app.services.qdrant_service import search_documents

results = search_documents(
    query="password",
    tenant_id="tenant_1",
)

print(results)