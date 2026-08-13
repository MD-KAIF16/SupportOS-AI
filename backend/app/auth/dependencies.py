"""
=========================================================
File: dependencies.py

Purpose:
Authentication dependency for protected routes.
=========================================================
"""

from fastapi import Depends
from fastapi.security import (
    HTTPAuthorizationCredentials,
    HTTPBearer,
)

from app.auth.security import verify_access_token
from app.core.supabase_client import supabase
from app.core.exceptions import (
    AuthenticationException,
    AuthorizationException,
)

security = HTTPBearer()



async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Verify JWT and return current user from database.
    """

    token = credentials.credentials

    payload = verify_access_token(token)

    user_id = payload.get("sub")

    if not user_id:
        raise AuthenticationException(
            "User ID not found in token."
        )

    response = (
        supabase
        .table("users")
        .select("*")
        .eq("id", user_id)
        .single()
        .execute()
    )

    if not response.data:
        raise AuthenticationException(
            "User not found."
        )

    return response.data

def require_role(allowed_roles: list[str]):
    """
    RBAC dependency.
    """

    async def role_checker(
        current_user=Depends(get_current_user),
    ):

        if current_user["role"] not in allowed_roles:

            raise AuthorizationException(
                "You don't have permission to access this resource."
            )


        return current_user

    return role_checker