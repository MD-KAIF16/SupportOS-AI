"""
=========================================================
File: user_profile.py

Purpose:
Defines Pydantic models for User Profile (Digital Twin).

Responsibilities:
1. Validate incoming profile requests
2. Standardize profile responses
3. Ensure type safety and validation

Data Flow

Frontend
      │
      ▼
UserProfileRequest
      │
      ▼
Validation
      │
      ▼
profile_service.py
      │
      ▼
UserProfileResponse
      │
      ▼
Frontend
=========================================================
"""

from uuid import UUID

from pydantic import (
    BaseModel,
    EmailStr,
    Field,
    field_validator,
)


# =========================================================
# User Profile Request
# =========================================================

class UserProfileRequest(BaseModel):
    """
    Validate incoming user profile request.
    """

    # -----------------------------------------------------
    # User ID
    # -----------------------------------------------------

    user_id: UUID = Field(
        ...,
        description="Supabase Auth User ID",
    )

    # -----------------------------------------------------
    # Tenant ID
    # -----------------------------------------------------

    tenant_id: UUID = Field(
        ...,
        description="Tenant ID",
    )

    # -----------------------------------------------------
    # Full Name
    # -----------------------------------------------------

    full_name: str = Field(
        ...,
        min_length=2,
        max_length=100,
        description="User full name",
    )

    # -----------------------------------------------------
    # Email
    # -----------------------------------------------------

    email: EmailStr = Field(
        ...,
        description="User email",
    )

    # -----------------------------------------------------
    # Company
    # -----------------------------------------------------

    company: str | None = Field(
        default=None,
        description="Company name",
    )

    # -----------------------------------------------------
    # Preferred Language
    # -----------------------------------------------------

    preferred_language: str = Field(
        default="English",
        description="Preferred language",
    )

    # -----------------------------------------------------
    # Preferred Tone
    # -----------------------------------------------------

    preferred_tone: str = Field(
        default="Friendly",
        description="Preferred AI response tone",
    )

    # -----------------------------------------------------
    # Validate Full Name
    # -----------------------------------------------------

    @field_validator("full_name")
    @classmethod
    def validate_full_name(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError(
                "Full name cannot be empty."
            )

        return value


# =========================================================
# User Profile Response
# =========================================================

class UserProfileResponse(BaseModel):
    """
    Standard response returned for user profile.
    """

    id: UUID = Field(
        ...,
        description="Profile ID",
    )

    user_id: UUID = Field(
        ...,
        description="User ID",
    )

    tenant_id: UUID = Field(
        ...,
        description="Tenant ID",
    )

    full_name: str = Field(
        ...,
        description="User full name",
    )

    email: EmailStr = Field(
        ...,
        description="User email",
    )

    company: str | None = Field(
        default=None,
        description="Company name",
    )

    preferred_language: str = Field(
        ...,
        description="Preferred language",
    )

    preferred_tone: str = Field(
        ...,
        description="Preferred AI response tone",
    )