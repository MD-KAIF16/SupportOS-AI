"""
=========================================================
File: auth_models.py

Purpose:
Authentication request and response models.
=========================================================
"""

from pydantic import BaseModel, EmailStr


# =========================================================
# Login Request
# =========================================================

class LoginRequest(BaseModel):
    email: EmailStr
    password: str


# =========================================================
# Login Response
# =========================================================

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user_id: str
    email: EmailStr
    role: str
    tenant_id: str


# =========================================================
# Register Request
# =========================================================

class RegisterRequest(BaseModel):
    email: EmailStr
    password: str
    full_name: str | None = None


# =========================================================
# Forgot Password Request
# =========================================================

class ForgotPasswordRequest(BaseModel):
    email: EmailStr
