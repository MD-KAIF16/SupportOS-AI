"""
chat_service.py

Purpose:
This file contains the BUSINESS LOGIC.

Routes should NEVER contain AI logic.

Today:
    Input  -> User Message
    Output -> "Understood"

Tomorrow:
    Input  -> User Message
    Output -> Gemini AI Response
"""

def generate_reply(message: str) -> str:
    """
    Generate a chatbot reply.

    Parameters
    ----------
    message : str
        Message received from the user.

    Returns
    -------
    str
        Reply that will be sent back to the frontend.
    """

    # -------------------------------------------------
    # Today we are NOT using the user's message.
    #
    # Example:
    # message = "Hello"
    #
    # We are returning a fixed(dummy) response.
    #
    # Day 8:
    # This line will be replaced by a Gemini API call.
    # -------------------------------------------------

    return "Understood"