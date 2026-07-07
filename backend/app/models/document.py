"""
document.py

Pydantic models for document upload.
"""

from datetime import datetime
from uuid import UUID

from pydantic import BaseModel


# Request Model (Swagger Input)
class SupportDocument(BaseModel):
    tenant_id: str
    title: str
    content: str


# Internal / Database Model
class StoredDocument(BaseModel):
    id: UUID
    tenant_id: UUID
    title: str
    content: str
    created_at: datetime