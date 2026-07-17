"""
=========================================================
File: profile.py

Purpose:
User Profile APIs
=========================================================
"""

from uuid import UUID

from fastapi import APIRouter, HTTPException

from app.models.response_models import APIResponse
from app.services.profile_service import profile_service

router = APIRouter(
    prefix="/profile",
    tags=["User Profile"],
)


# =========================================================
# Get Profile
# =========================================================

@router.get(
    "/{tenant_id}/{user_id}",
    response_model=APIResponse,
)
async def get_user_profile(
    tenant_id: UUID,
    user_id: UUID,
):
    """
    Fetch user profile.
    """

    try:

        profile = profile_service.get_profile(
            user_id=user_id,
            tenant_id=tenant_id,
        )

        return APIResponse(
            success=True,
            message="Profile fetched successfully.",
            data=profile,
        )

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=str(e),
        )