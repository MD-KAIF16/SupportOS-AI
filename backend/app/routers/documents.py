from fastapi import APIRouter

from app.models.document import SupportDocument
from app.services.document_service import create_document_service

router = APIRouter(
    prefix="/documents",
    tags=["Documents"]
)


@router.post("/")
async def create_document(document: SupportDocument):

    result = await create_document_service(document)

    return result