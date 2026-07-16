"""
=========================================================
File: profile.py

Purpose:
User Profile APIs.

Endpoints:
1. Create Profile
2. Get Profile
=========================================================
"""

from fastapi import APIRouter

from app.models.response_model import APIResponse
from app.models.user_profile import (
    UserProfileRequest,
)
from app.services.profile_service import (
    create_profile,
    get_profile,
)

router = APIRouter(
    prefix="/profile",
    tags=["User Profile"],
)


# =========================================================
# Create Profile
# =========================================================

@router.post(
    "",
    response_model=APIResponse,
)
async def create_user_profile(
    profile: UserProfileRequest,
):
    """
    Create user profile.
    """

    data = create_profile(profile)

    return APIResponse(
        success=True,
        message="Profile created successfully.",
        data=data,
    )


# =========================================================
# Get Profile
# =========================================================

@router.get(
    "/{user_id}",
    response_model=APIResponse,
)
async def get_user_profile(
    user_id: str,
):
    """
    Fetch user profile.
    """

    data = get_profile(user_id)

    return APIResponse(
        success=True,
        message="Profile fetched successfully.",
        data=data,
    )