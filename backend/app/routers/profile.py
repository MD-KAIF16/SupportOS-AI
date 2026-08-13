"""
=========================================================
File: profile.py

Purpose:
User Profile APIs
=========================================================
"""

from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException

from app.auth.dependencies import get_current_user
from app.core.exceptions import AuthorizationException
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
    current_user: dict = Depends(get_current_user),
):
    """
    Fetch user profile.
    """

    authenticated_tenant_id = UUID(current_user["tenant_id"])
    authenticated_user_id = UUID(current_user["id"])
    is_admin = current_user.get("role", "").lower() == "admin"

    if tenant_id != authenticated_tenant_id:
        raise AuthorizationException(
            "You don't have permission to access this tenant's profile."
        )

    if not is_admin and user_id != authenticated_user_id:
        raise AuthorizationException(
            "You don't have permission to access this user's profile."
        )

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