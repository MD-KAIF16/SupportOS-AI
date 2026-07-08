"""
=========================================================
File: chat.py

Purpose:
Chat API Router

Responsibilities:
1. Receive chat request
2. Validate request
3. Call chat service
4. Return standard API response

Data Flow

Frontend
      │
      ▼
POST /chat
      │
      ▼
ChatRequest
      │
      ▼
chat_service.py
      │
      ▼
ChatResponse
      │
      ▼
APIResponse
=========================================================
"""

from fastapi import APIRouter

from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
)

from app.models.response_model import APIResponse

from app.services.chat_service import chat_with_ai

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# =========================================================
# Chat Endpoint
# =========================================================

@router.post(
    "",
    response_model=APIResponse,
)
def chat(request: ChatRequest):
    """
    Generate AI response using RAG.
    """

    # Call chat service
    result = chat_with_ai(
        question=request.message,
        tenant_id=request.tenant_id,
    )

    # Return standard API response
    return APIResponse(
        success=True,
        message="Chat generated successfully.",
        data=ChatResponse(**result),
    )