"""
=========================================================
File: chat.py

Purpose:
Chat API endpoint.
=========================================================
"""

from fastapi import APIRouter, Depends

from app.auth.dependencies import get_current_user
from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
)
from app.models.response_models import APIResponse
from app.services.chat_service import chat_with_ai

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


@router.post(
    "",
    response_model=APIResponse,
)
def chat(
    request: ChatRequest,
    current_user=Depends(get_current_user),
):
    """
    Execute SupportOS AI chat workflow.
    """

    result = chat_with_ai(
        question=request.question,
        user_id=current_user["id"],
        tenant_id=current_user["tenant_id"],
    )

    return APIResponse(
        success=True,
        message="Chat completed successfully.",
        data=ChatResponse(
            reply=result["reply"],
            documents=result["documents"],
        ),
    )


@router.get("/admin-test")
async def admin_test(
    current_user=Depends(get_current_user),
):
    return {
        "message": "Welcome Admin",
        "user": current_user,
    }