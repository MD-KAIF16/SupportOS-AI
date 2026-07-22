"""
=========================================================
File: chat_models.py

Purpose:
Defines request and response models for Chat APIs.
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

    question: str = Field(
        ...,
        min_length=3,
        max_length=2000,
        description="User question",
    )

    @field_validator("question")
    @classmethod
    def validate_question(cls, value: str):
        value = value.strip()

        if not value:
            raise ValueError(
                "Question cannot be empty."
            )

        return value


# =========================================================
# Chat Response Model
# =========================================================

class ChatResponse(BaseModel):

    reply: str

    documents: list[dict] = Field(default_factory=list)