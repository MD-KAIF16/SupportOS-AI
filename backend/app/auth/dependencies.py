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

security = HTTPBearer()


async def get_current_user(
    credentials: HTTPAuthorizationCredentials = Depends(security),
):
    """
    Extract and verify JWT token.
    """

    token = credentials.credentials

    payload = verify_access_token(token)

    return payload