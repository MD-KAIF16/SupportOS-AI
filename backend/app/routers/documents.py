"""
=========================================================
File: documents.py

Purpose:
Knowledge Base & Document Management API Router
Strict Admin Authorization & Tenant Isolation Enforced.
=========================================================
"""

import io
from uuid import UUID
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, status
from pypdf import PdfReader

from app.auth.dependencies import get_current_user
from app.models.document_models import SupportDocument
from app.services.document_service import (
    create_document_service,
    list_documents_service,
    delete_document_service,
)

router = APIRouter(
    prefix="/documents",
    tags=["Documents"],
)


def verify_admin_role(current_user: dict):
    """
    Verify user role is admin.
    """
    user_role = current_user.get("role", "").lower()
    if user_role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Admin authorization required to manage Knowledge Base.",
        )


# =========================================================
# List Documents (Admin Only)
# =========================================================

@router.get("/")
def list_documents(
    current_user: dict = Depends(get_current_user),
):
    """
    List all Knowledge Base documents for authenticated admin's tenant.
    """
    verify_admin_role(current_user)
    tenant_id = UUID(current_user["tenant_id"])
    docs = list_documents_service(tenant_id=tenant_id)
    return {
        "success": True,
        "documents": docs,
    }


# =========================================================
# Create Document JSON (Admin Only)
# =========================================================

@router.post("/")
async def create_document(
    document: SupportDocument,
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a support document via raw JSON.
    """
    verify_admin_role(current_user)
    # Force authenticated tenant_id for tenant safety
    document.tenant_id = UUID(current_user["tenant_id"])
    result = await create_document_service(document)
    return result


# =========================================================
# Upload Document File (PDF / TXT / MD) (Admin Only)
# =========================================================

@router.post("/upload")
async def upload_document_file(
    file: UploadFile = File(...),
    title: str = Form(None),
    current_user: dict = Depends(get_current_user),
):
    """
    Upload a support document file (.pdf, .txt, .md).
    Extracts text content and ingests into Supabase & Qdrant.
    """
    verify_admin_role(current_user)
    filename = file.filename or "uploaded_document"
    doc_title = title if title and title.strip() else filename

    content_bytes = await file.read()
    extracted_text = ""

    if filename.lower().endswith(".pdf"):
        try:
            pdf_file = io.BytesIO(content_bytes)
            reader = PdfReader(pdf_file)
            page_texts = [page.extract_text() for page in reader.pages if page.extract_text()]
            extracted_text = "\n\n".join(page_texts)
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to extract text from PDF: {str(e)}",
            )
    else:
        # Plain text / markdown
        try:
            extracted_text = content_bytes.decode("utf-8", errors="ignore")
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Failed to read text file: {str(e)}",
            )

    if not extracted_text.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded document contains no readable text.",
        )

    doc_obj = SupportDocument(
        tenant_id=UUID(current_user["tenant_id"]),
        title=doc_title,
        content=extracted_text,
    )

    result = await create_document_service(doc_obj)
    return result


# =========================================================
# Delete Document (Admin Only)
# =========================================================

@router.delete("/{document_id}")
def delete_document_endpoint(
    document_id: str,
    current_user: dict = Depends(get_current_user),
):
    """
    Delete document from Supabase & Qdrant by ID.
    """
    verify_admin_role(current_user)
    tenant_id = UUID(current_user["tenant_id"])
    result = delete_document_service(document_id=document_id, tenant_id=tenant_id)
    return result