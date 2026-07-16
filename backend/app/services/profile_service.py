"""
=========================================================
File: profile_service.py

Purpose:
Business logic for User Profile.

Responsibilities:
1. Create user profile
2. Fetch user profile
=========================================================
"""

from app.core.supabase import supabase
from app.models.user_profile import UserProfileRequest


# =========================================================
# Create Profile
# =========================================================

def create_profile(profile: UserProfileRequest):
    """
    Create a new user profile.
    """

    profile_data = profile.model_dump(mode="json")

    response = (
        supabase
        .table("user_profiles")
        .insert(profile_data)
        .execute()
    )

    return response.data


# =========================================================
# Get Profile
# =========================================================

def get_profile(user_id: str):
    """
    Fetch profile using user id.

    Returns:
        dict : User profile
        {}   : If profile does not exist
    """

    try:

        response = (
            supabase
            .table("user_profiles")
            .select("*")
            .eq(
                "user_id",
                user_id,
            )
            .single()
            .execute()
        )

        return response.data or {}

    except Exception as e:

        print(f"❌ Profile Fetch Error: {e}")

        return {}