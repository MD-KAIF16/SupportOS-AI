"""
=========================================================
File: profile_service.py
=========================================================
"""

from uuid import UUID

from supabase import Client

from app.core.supabase_client import supabase
from app.models.user_profile_models import UserProfileRequest


class ProfileService:

    def __init__(self, db: Client = supabase):
        self.db = db

    def create_profile(
        self,
        profile: UserProfileRequest,
    ) -> dict:
        """
        Create a new user profile.
        """

        response = (
            self.db
            .table("user_profiles")
            .insert(profile.model_dump(mode="json"))
            .execute()
        )

        if not response.data:
            raise Exception("Failed to create profile.")

        return response.data[0]

    def get_profile(
        self,
        user_id: UUID,
        tenant_id: UUID,
    ) -> dict:
        """
        Fetch Digital Twin profile.
        """

        response = (
            self.db
            .table("user_profiles")
            .select("*")
            .eq("user_id", str(user_id))
            .eq("tenant_id", str(tenant_id))
            .single()
            .execute()
        )

        if not response.data:
            return {}

        return response.data


profile_service = ProfileService()


# =========================================================
# Backward Compatibility
# =========================================================

def create_profile(profile: UserProfileRequest):
    return profile_service.create_profile(profile)


def get_profile(user_id: UUID, tenant_id: UUID):
    return profile_service.get_profile(user_id, tenant_id)