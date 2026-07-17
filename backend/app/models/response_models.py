"""
=========================================================
File: response_model.py

Purpose:
Common response model for every API.

Example

{
    "success": true,
    "message": "...",
    "data": {...}
}
=========================================================
"""

from typing import Any
from pydantic import BaseModel


class APIResponse(BaseModel):
    """
    Standard API Response
    """

    success: bool
    message: str
    data: Any = None