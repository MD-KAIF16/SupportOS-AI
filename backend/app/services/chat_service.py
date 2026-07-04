"""
chat_service.py

Purpose
-------
This file contains the BUSINESS LOGIC.

Routes should NEVER contain AI logic.

Flow
----
Frontend
    ↓
Router
    ↓
Service Layer
    ↓
Gemini
    ↓
Frontend
"""

from app.services.gemini import ask_gemini


def generate_reply(message: str) -> str:
    """
    Generate an AI chatbot reply.

    Parameters
    ----------
    message : str
        User message received from the frontend.

    Returns
    -------
    str
        AI-generated reply.
    """

    try:
        # Send the user's message to Gemini
        reply = ask_gemini(message)

        # Return Gemini's response
        return reply

    except Exception as e:
        # Log the error for debugging
        print(f"[Gemini Error] {e}")

        # Fallback response shown to the user
        return (
            "Sorry! I'm unable to generate a response right now. "
            "Please try again in a moment."
        )