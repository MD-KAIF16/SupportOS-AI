"""
=========================================================
File: chat_models.py

Purpose:
Defines request and response models for Chat APIs.

Responsibilities:
1. Validate incoming chat requests
2. Sanitize user input
3. Define outgoing chat responses

Data Flow

Frontend
      │
      ▼
ChatRequest
      │
      ▼
Validation
      │
      ▼
chat_service.py
      │
      ▼
ChatResponse
      │
      ▼
Frontend
=========================================================
"""

from pydantic import (
    BaseModel,
    Field,
    field_validator,
)


# =========================================================
# Chat Request Model
# =========================================================

class ChatRequest(BaseModel):
    """
    Validate incoming chat request.
    """

    # -----------------------------------------------------
    # Tenant ID
    # -----------------------------------------------------

    tenant_id: str = Field(
        ...,
        description="Tenant UUID",
    )

    # -----------------------------------------------------
    # User ID
    # -----------------------------------------------------

    user_id: str = Field(
        ...,
        description="User UUID",
    )

    # -----------------------------------------------------
    # User Question
    # -----------------------------------------------------

    message: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="User question",
    )

    # -----------------------------------------------------
    # Validate User Message
    # -----------------------------------------------------

    @field_validator("message")
    @classmethod
    def validate_message(cls, value: str):
        """
        Remove unnecessary spaces and
        reject empty messages.
        """

        value = value.strip()

        if not value:
            raise ValueError(
                "Message cannot be empty."
            )

        return value


# =========================================================
# Chat Response Model
# =========================================================

class ChatResponse(BaseModel):
    """
    Standard response returned by chat API.
    """

    # AI Generated Reply
    reply: str = Field(
        ...,
        description="AI generated response",
    )

    # Retrieved Documents
    documents: list[dict] = Field(
        default_factory=list,
        description="Retrieved documents from Qdrant",
    )