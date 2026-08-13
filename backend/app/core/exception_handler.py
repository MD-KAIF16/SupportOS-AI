"""
=========================================================
File: exception_handler.py

Purpose:
Centralized exception handling for the entire application.

Responsibilities:
1. Catch custom exceptions
2. Return proper HTTP status codes
3. Log errors
4. Return standard API responses
=========================================================
"""

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.core.logger import logger
from app.core.exceptions import (
    EmbeddingException,
    QdrantException,
    ChatGenerationException,
    DocumentNotFoundException,
    AuthenticationException,
    AuthorizationException,
)


def register_exception_handlers(app: FastAPI):

    # =====================================================
    # Document Not Found Exception
    # =====================================================

    @app.exception_handler(DocumentNotFoundException)
    async def document_not_found_handler(
        request: Request,
        exc: DocumentNotFoundException,
    ):

        logger.warning(str(exc))

        return JSONResponse(
            status_code=404,
            content={
                "success": False,
                "message": str(exc),
                "data": None,
            },
        )

    # =====================================================
    # Embedding Exception
    # =====================================================

    @app.exception_handler(EmbeddingException)
    async def embedding_handler(
        request: Request,
        exc: EmbeddingException,
    ):

        logger.error(str(exc))

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": str(exc),
                "data": None,
            },
        )

    # =====================================================
    # Qdrant Exception
    # =====================================================

    @app.exception_handler(QdrantException)
    async def qdrant_handler(
        request: Request,
        exc: QdrantException,
    ):

        logger.error(str(exc))

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": str(exc),
                "data": None,
            },
        )

    # =====================================================
    # Gemini Exception
    # =====================================================

    @app.exception_handler(ChatGenerationException)
    async def gemini_handler(
        request: Request,
        exc: ChatGenerationException,
    ):

        logger.error(str(exc))

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": str(exc),
                "data": None,
            },
        )

    # =====================================================
    # Authentication Exception (HTTP 401)
    # =====================================================

    @app.exception_handler(AuthenticationException)
    async def authentication_handler(
        request: Request,
        exc: AuthenticationException,
    ):

        logger.warning(str(exc))

        return JSONResponse(
            status_code=401,
            content={
                "success": False,
                "message": str(exc),
                "data": None,
            },
        )

    # =====================================================
    # Authorization Exception (HTTP 403)
    # =====================================================

    @app.exception_handler(AuthorizationException)
    async def authorization_handler(
        request: Request,
        exc: AuthorizationException,
    ):

        logger.warning(str(exc))

        return JSONResponse(
            status_code=403,
            content={
                "success": False,
                "message": str(exc),
                "data": None,
            },
        )


    # =====================================================
    # Unknown Exception
    # =====================================================

    @app.exception_handler(Exception)
    async def global_exception_handler(
        request: Request,
        exc: Exception,
    ):

        logger.exception(str(exc))

        return JSONResponse(
            status_code=500,
            content={
                "success": False,
                "message": "Internal Server Error",
                "data": None,
            },
        )