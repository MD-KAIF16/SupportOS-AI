from fastapi import APIRouter
from app.models.search_models import SearchRequest
from app.services.qdrant_service import search_documents

router = APIRouter(
    prefix="/api",
    tags=["Search"]
)


@router.post("/search")
def search(request: SearchRequest):

    documents = search_documents(
        request.query,
        request.tenant_id
    )

    return {
        "documents": documents
    }