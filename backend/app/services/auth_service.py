"""
=========================================================
File: auth_service.py

Purpose:
Authenticate user using Supabase Auth
and issue backend JWT.
=========================================================
"""

from supabase_auth.errors import AuthApiError

from app.core.supabase_client import (
    supabase_auth,
    supabase_db,
)
from app.auth.security import create_access_token
from app.core.exceptions import AuthenticationException


class AuthService:

    def __init__(self):
        self.auth = supabase_auth
        self.db = supabase_db

    def login(
        self,
        email: str,
        password: str,
    ) -> dict:
        """
        Authenticate user using Supabase Auth
        and fetch application user.
        """

        # -------------------------------------------------
        # Authenticate with Supabase Auth
        # -------------------------------------------------

        try:

            auth_response = self.auth.auth.sign_in_with_password(
                {
                    "email": email,
                    "password": password,
                }
            )

        except AuthApiError:

            raise AuthenticationException(
                "Invalid email or password."
            )

        if not auth_response.user:

            raise AuthenticationException(
                "Invalid email or password."
            )

        # -------------------------------------------------
        # Fetch application user from public.users
        # -------------------------------------------------

        user = (
            self.db
            .table("users")
            .select("*")
            .eq("email", email)
            .single()
            .execute()
        )

        if not user.data:

            raise AuthenticationException(
                "User profile not found."
            )

        # -------------------------------------------------
        # Create Backend JWT
        # -------------------------------------------------

        access_token = create_access_token(
            {
                "sub": str(user.data["id"]),
                "email": user.data["email"],
                "role": user.data["role"],
            }
        )

        # -------------------------------------------------
        # Return Login Response
        # -------------------------------------------------

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user.data["id"]),
            "email": user.data["email"],
            "role": user.data["role"],
        }


auth_service = AuthService()