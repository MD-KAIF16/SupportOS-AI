"""
Pydantic models for Chat API.
"""

from typing import Any

from pydantic import BaseModel


class ChatRequest(BaseModel):
    tenant_id: str
    message: str


class ChatResponse(BaseModel):
    reply: str
    documents: list[dict[str, Any]]