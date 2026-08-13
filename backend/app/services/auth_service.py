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

    def register(
        self,
        email: str,
        password: str,
        full_name: str | None = None,
    ) -> dict:
        """
        Register a new customer (end_user) in Supabase Auth & public.users table.
        Admin role is strictly forbidden through self-registration.
        """
        # Check if user already exists in public.users
        try:
            existing = (
                self.db
                .table("users")
                .select("*")
                .eq("email", email)
                .execute()
            )
            if existing.data and len(existing.data) > 0:
                raise AuthenticationException("An account with this email already exists.")
        except AuthenticationException:
            raise
        except Exception:
            pass

        # Create user in Supabase Auth
        try:
            auth_response = self.auth.auth.sign_up(
                {
                    "email": email,
                    "password": password,
                }
            )
        except AuthApiError as ae:
            logger.warning(f"Supabase AuthApiError during registration for {email}: {ae}")
            raise AuthenticationException(str(ae))
        except Exception as e:
            logger.exception(f"Supabase sign_up error for {email}: {e}")
            raise AuthenticationException("Registration failed. Please try again.")

        if not auth_response or not auth_response.user:
            raise AuthenticationException("Registration failed to create authentication credentials.")

        user_id = str(auth_response.user.id)
        default_tenant_id = "11111111-1111-1111-1111-111111111111"
        # STRICT SECURITY ENFORCEMENT: Customer role ONLY
        assigned_role = "end_user"

        try:
            new_user_payload = {
                "id": user_id,
                "email": email,
                "role": assigned_role,
                "tenant_id": default_tenant_id,
            }
            self.db.table("users").upsert(new_user_payload).execute()
        except Exception as ex:
            logger.exception(f"Failed to create public user record for {email}: {ex}")
            raise AuthenticationException("Failed to finalize user registration profile.")

        # Log in the new user immediately to issue JWT
        return self.login(email=email, password=password)

    def forgot_password(
        self,
        email: str,
        redirect_to: str | None = None,
    ) -> dict:
        """
        Initiate Supabase password reset for the specified email.
        """
        try:
            options = {}
            if redirect_to:
                options["redirectTo"] = redirect_to

            self.auth.auth.reset_password_for_email(email, options)
            return {
                "message": "If an account exists for this email, a password reset link has been sent."
            }
        except AuthApiError as ae:
            logger.warning(f"Supabase AuthApiError during forgot_password for {email}: {ae}")
            return {
                "message": "If an account exists for this email, a password reset link has been sent."
            }
        except Exception as e:
            logger.exception(f"Error during forgot_password for {email}: {e}")
            return {
                "message": "If an account exists for this email, a password reset link has been sent."
            }


auth_service = AuthService()