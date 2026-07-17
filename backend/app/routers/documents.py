"""
=========================================================
File: documents.py

Purpose:
Document Upload API

Responsibilities:
1. Receive upload request
2. Validate request
3. Call document service
4. Return API response
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from fastapi import APIRouter

from app.models.document_models import SupportDocument
from app.services.document_service import create_document_service


# =========================================================
# Router
# =========================================================

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


# =========================================================
# Upload Document
# =========================================================

@router.post("/")
async def create_document(
    document: SupportDocument,
):
    """
    Upload a support document.
    """

    result = await create_document_service(document)

    return result