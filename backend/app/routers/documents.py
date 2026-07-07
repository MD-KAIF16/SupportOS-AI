"""
documents.py

Purpose:
Receive document upload request.

Flow

Swagger
    ↓
Validate Request
    ↓
Service Layer
    ↓
Return Response
"""

from fastapi import APIRouter

from app.models.document import SupportDocument
from app.services.document_service import create_document_service

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


@router.post("/")
async def create_document(document: SupportDocument):
    """
    Upload a support document.
    """

    # Call service layer
    result = await create_document_service(document)

    # Return API response
    return result