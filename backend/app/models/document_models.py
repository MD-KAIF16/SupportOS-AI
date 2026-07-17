"""
=========================================================
File: document_models.py

Purpose:
Pydantic models for document upload and storage.
=========================================================
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


# =========================================================
# Request Model
# =========================================================

class SupportDocument(BaseModel):
    """
    Request model used for uploading a support document.
    """

    tenant_id: UUID | str
    title: str
    content: str


# =========================================================
# Stored Document Model
# =========================================================

class StoredDocument(BaseModel):
    """
    Internal model representing a stored document.
    """

    id: UUID
    tenant_id: UUID
    title: str
    content: str
    created_at: datetime