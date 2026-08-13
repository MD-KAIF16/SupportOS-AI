"""
=========================================================
File: analytics.py

Purpose:
Tenant Analytics API router.
=========================================================
"""

from uuid import UUID
from fastapi import APIRouter, Depends
from app.auth.dependencies import get_current_user, require_role
from app.services.analytics_service import analytics_service

router = APIRouter(
    prefix="/api/analytics",
    tags=["Analytics"],
)


@router.get("")
def get_analytics(
    current_user: dict = Depends(require_role(["admin"])),
):
    """
    Get tenant analytics overview for current user's tenant (Admin Only).
    """
    tenant_id = UUID(current_user["tenant_id"])
    data = analytics_service.get_tenant_analytics(tenant_id=tenant_id)
    return {
        "success": True,
        "data": data
    }

