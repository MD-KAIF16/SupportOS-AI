"""
=========================================================
File: exceptions.py

Purpose:
Custom exceptions used across SupportOS AI.
=========================================================
"""


# =========================================================
# Base Exception
# =========================================================

class SupportOSException(Exception):
    """
    Base exception for the entire SupportOS AI project.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


# =========================================================
# Embedding
# =========================================================

class EmbeddingException(SupportOSException):
    """Raised when embedding generation fails."""
    pass


# =========================================================
# Qdrant
# =========================================================

class QdrantException(SupportOSException):
    """Raised when Qdrant operations fail."""
    pass


# =========================================================
# Supabase
# =========================================================

class SupabaseException(SupportOSException):
    """Raised when Supabase operations fail."""
    pass


# =========================================================
# Gemini
# =========================================================

class ChatGenerationException(SupportOSException):
    """Raised when Gemini fails to generate a response."""
    pass


# =========================================================
# Documents
# =========================================================

class DocumentNotFoundException(SupportOSException):
    """Raised when no relevant documents are found."""
    pass