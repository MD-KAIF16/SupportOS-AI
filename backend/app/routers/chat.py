"""
chat.py

Purpose:
Receive requests from the frontend.

Route responsibilities:
1. Receive request
2. Validate request (Pydantic)
3. Call Service Layer
4. Return Response

Routes SHOULD NOT contain business logic.
"""

# APIRouter is used to create a group of related APIs
from fastapi import APIRouter

# Import request & response models
from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
)

# Import business logic
from app.services.chat_service import (
    generate_reply,
)

# Create router object
router = APIRouter()


# POST API
#
# Endpoint:
# POST /chat
#
# Response format:
# ChatResponse
#
@router.post(
    "/chat",
    response_model=ChatResponse,
)
async def chat(request: ChatRequest):
    """
    Chat API

    Flow

    Frontend
        ↓
    ChatRequest
        ↓
    Service Layer
        ↓
    ChatResponse
        ↓
    Frontend
    """

    # Call business logic
    #
    # request.message
    # Example:
    # "Hello"
    #
    reply = generate_reply(
        request.message
    )

    # Return response object
    #
    # FastAPI automatically converts
    # ChatResponse -> JSON
    #
    return ChatResponse(
        reply=reply
    )