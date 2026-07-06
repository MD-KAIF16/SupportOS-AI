from pydantic import BaseModel
from uuid import UUID
from datetime import datetime


class SupportDocument(BaseModel):
    id: UUID
    tenant_id: UUID
    title: str
    content: str
    created_at: datetime