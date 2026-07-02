"""
chat_models.py

Purpose:
Define the data format (contract) between Frontend and Backend.

Models NEVER contain business logic.
They only describe what data should come in
and what data should go out.
"""

# Import BaseModel from Pydantic
# BaseModel automatically validates incoming data
from pydantic import BaseModel


class ChatRequest(BaseModel):
    """
    Incoming request from the frontend.

    Example JSON:
    {
        "user_id": "123",
        "message": "Hello"
    }
    """

    # Unique user identifier
    user_id: str

    # User's message sent to the chatbot
    message: str


class ChatResponse(BaseModel):
    """
    Outgoing response returned to the frontend.

    Example JSON:
    {
        "reply": "Understood"
    }
    """

    # AI reply that will be shown in the UI
    reply: str