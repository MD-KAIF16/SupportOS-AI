"""
=========================================================
File: auth_service.py

Purpose:
Authenticate user using Supabase Auth
and issue backend JWT.
=========================================================
"""

from supabase_auth.errors import AuthApiError
from app.core.logger import logger

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

        except AuthApiError as ae:

            logger.warning(f"Supabase AuthApiError during login for {email}: {ae}")
            raise AuthenticationException(
                "Invalid email or password."
            )

        except Exception as e:

            logger.exception(f"Supabase Auth connection error during login for {email}: {e}")
            raise AuthenticationException(
                "Authentication service connection failed. Please check network or Supabase service status."
            )

        if not auth_response or not auth_response.user:

            raise AuthenticationException(
                "Invalid email or password."
            )

        # -------------------------------------------------
        # Fetch application user from public.users
        # -------------------------------------------------

        try:

            user = (
                self.db
                .table("users")
                .select("*")
                .eq("email", email)
                .single()
                .execute()
            )

        except Exception as ex:

            logger.exception(f"Failed to query user profile for {email}: {ex}")
            raise AuthenticationException(
                "User profile lookup failed."
            )

        if not user.data:

            raise AuthenticationException(
                "User profile not found."
            )

        # -------------------------------------------------
        # Create Backend JWT
        # -------------------------------------------------

        user_data = user.data
        access_token = create_access_token(
            {
                "sub": str(user_data["id"]),
                "email": user_data["email"],
                "role": user_data.get("role", "user"),
                "tenant_id": str(user_data.get("tenant_id", "")),
            }
        )

        # -------------------------------------------------
        # Return Login Response
        # -------------------------------------------------

        return {
            "access_token": access_token,
            "token_type": "bearer",
            "user_id": str(user_data["id"]),
            "email": user_data["email"],
            "role": user_data.get("role", "user"),
            "tenant_id": str(user_data.get("tenant_id", "")),
        }


auth_service = AuthService()