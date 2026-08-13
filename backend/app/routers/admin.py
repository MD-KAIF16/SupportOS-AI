"""
=========================================================
File: admin.py

Purpose:
Admin Operational Dashboard APIs.
Strict Admin Role Enforcement & Tenant Isolation Required.
=========================================================
"""

from uuid import UUID
from fastapi import APIRouter, Depends

from app.auth.dependencies import require_role
from app.models.response_models import APIResponse
from app.services.analytics_service import analytics_service
from app.services.document_service import list_documents_service

router = APIRouter(
    prefix="/api/admin",
    tags=["Admin Management"],
)


@router.get("/dashboard", response_model=APIResponse)
def get_admin_dashboard(
    current_user: dict = Depends(require_role(["admin"])),
):
    """
    Fetch comprehensive operational metrics for authenticated admin's tenant.
    """
    tenant_id = UUID(current_user["tenant_id"])

    analytics = analytics_service.get_tenant_analytics(tenant_id=tenant_id)
    documents = list_documents_service(tenant_id=tenant_id)


    dashboard_data = {
        "tenant_id": str(tenant_id),
        "total_documents": len(documents),
        "total_conversations": analytics.get("total_conversations", 0),
        "total_tickets": analytics.get("total_tickets", 0),
        "open_tickets": analytics.get("open_tickets", 0),
        "resolved_tickets": analytics.get("resolved_tickets", 0),
        "escalated_tickets": analytics.get("escalated_tickets", 0),
        "ai_resolution_rate": analytics.get("ai_resolution_rate", 100.0),
    }

    return APIResponse(
        success=True,
        message="Admin dashboard metrics fetched successfully.",
        data=dashboard_data,
    )
