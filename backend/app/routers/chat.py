"""
chat.py

Purpose:
Receive requests from frontend.

Flow

Frontend
    ↓
ChatRequest
    ↓
Service Layer
    ↓
ChatResponse
"""

from fastapi import APIRouter

from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
)

from app.services.chat_service import (
    chat_with_ai,
)

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "/",
    response_model=ChatResponse,
)
def chat(request: ChatRequest):
    """
    Chat Endpoint
    """

    result = chat_with_ai(
        question=request.message,
        tenant_id=request.tenant_id,
    )

    return ChatResponse(
        reply=result["reply"],
        documents=result["documents"],
    )