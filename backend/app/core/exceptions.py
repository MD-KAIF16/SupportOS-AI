class SupportOSException(Exception):
    """
    Base exception for the entire SupportOS AI project.
    """

    def __init__(self, message: str):
        self.message = message
        super().__init__(message)


class EmbeddingException(SupportOSException):
    """Raised when embedding generation fails."""
    pass


class QdrantException(SupportOSException):
    """Raised when Qdrant operations fail."""
    pass


class SupabaseException(SupportOSException):
    """Raised when Supabase operations fail."""
    pass


class ChatGenerationException(SupportOSException):
    """Raised when Gemini fails to generate a response."""
    pass


class DocumentNotFoundException(SupportOSException):
    """Raised when no relevant documents are found."""
    pass