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
    RegisterRequest,
    ForgotPasswordRequest,
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


# =========================================================
# Register Endpoint (Customer Only)
# =========================================================

@router.post(
    "/register",
    response_model=APIResponse,
)
def register(
    request: RegisterRequest,
):
    """
    Register new Customer (end_user) account. Admin role is forbidden.
    """

    result = auth_service.register(
        email=request.email,
        password=request.password,
        full_name=request.full_name,
    )

    return APIResponse(
        success=True,
        message="Account created successfully.",
        data=LoginResponse(**result),
    )


# =========================================================
# Forgot Password Endpoint
# =========================================================

@router.post(
    "/forgot-password",
    response_model=APIResponse,
)
def forgot_password(
    request: ForgotPasswordRequest,
):
    """
    Initiate password reset for user email.
    """

    result = auth_service.forgot_password(
        email=request.email,
    )

    return APIResponse(
        success=True,
        message=result["message"],
        data=None,
    )