"""
=========================================================
File: chat.py

Purpose:
Chat API endpoint.

Flow

Frontend
      │
      ▼
Chat Router
      │
      ▼
Chat Service
      │
      ▼
LangGraph
      │
      ▼
Response
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from fastapi import APIRouter, Depends

from app.auth.dependencies import require_role
from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
)
from app.models.response_models import APIResponse
from app.services.chat_service import chat_with_ai

# =========================================================
# Router
# =========================================================

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
def chat(
    request: ChatRequest,
):
    """
    Execute SupportOS AI chat workflow.
    """

    result = chat_with_ai(
        question=request.question,
        user_id=request.user_id,
        tenant_id=request.tenant_id,
    )

    return APIResponse(
        success=True,
        message="Chat completed successfully.",
        data=ChatResponse(
            reply=result["reply"],
            documents=result["documents"],
        ),
    )


# =========================================================
# Admin RBAC Test
# =========================================================

@router.get("/admin-test")
async def admin_test(
    current_user=Depends(require_role(["admin"]))
):
    """
    Test endpoint for Admin RBAC.
    """

    return {
        "message": "Welcome Admin",
        "user": current_user,
    }