"""
=========================================================
File: auth.py

Purpose:
Authentication API endpoints.
=========================================================
"""

from fastapi import APIRouter

from app.models.auth_models import (
    LoginRequest,
    LoginResponse,
)
from app.models.response_models import APIResponse
from app.services.auth_service import auth_service


# =========================================================
# Router
# =========================================================

router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"],
)


# =========================================================
# Login Endpoint
# =========================================================

@router.post(
    "/login",
    response_model=APIResponse,
)
def login(
    request: LoginRequest,
):
    """
    Authenticate user and return JWT.
    """

    result = auth_service.login(
        email=request.email,
        password=request.password,
    )

    return APIResponse(
        success=True,
        message="Login successful.",
        data=LoginResponse(**result),
    )