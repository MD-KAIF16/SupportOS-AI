"""
=========================================================
File: analytics_service.py

Purpose:
Tenant analytics service respecting tenant isolation.
=========================================================
"""

from uuid import UUID
from supabase import Client
from app.core.logger import logger
from app.core.supabase_client import supabase


class AnalyticsService:

    def __init__(self, db: Client = supabase):
        self.db = db

    def get_tenant_analytics(self, tenant_id: UUID) -> dict:
        """
        Compute real-time metrics for a specific tenant.
        Strict tenant isolation enforced.
        """
        try:
            tid_str = str(tenant_id)

            # 1. Total Conversations Count
            conv_resp = (
                self.db
                .table("conversations")
                .select("id", count="exact")
                .eq("tenant_id", tid_str)
                .execute()
            )
            total_conversations = conv_resp.count if conv_resp.count is not None else len(conv_resp.data or [])

            # 2. Total Tickets
            tickets_resp = (
                self.db
                .table("tickets")
                .select("*")
                .eq("tenant_id", tid_str)
                .execute()
            )
            tickets = tickets_resp.data or []
            total_tickets = len(tickets)

            open_tickets = sum(1 for t in tickets if t.get("status", "").lower() in ["open", "pending", "in progress"])
            resolved_tickets = sum(1 for t in tickets if t.get("status", "").lower() in ["resolved", "closed"])
            escalated_tickets = sum(1 for t in tickets if t.get("status", "").lower() == "escalated")

            ai_resolution_rate = round(
                ((total_conversations - escalated_tickets) / total_conversations * 100)
                if total_conversations > 0 else 100.0,
                1
            )

            return {
                "tenant_id": tid_str,
                "total_conversations": total_conversations,
                "total_tickets": total_tickets,
                "open_tickets": open_tickets,
                "resolved_tickets": resolved_tickets,
                "escalated_tickets": escalated_tickets,
                "ai_resolution_rate": ai_resolution_rate,
            }

        except Exception as e:
            logger.exception(f"Failed to compute tenant analytics: {e}")
            return {
                "tenant_id": str(tenant_id),
                "total_conversations": 0,
                "total_tickets": 0,
                "open_tickets": 0,
                "resolved_tickets": 0,
                "escalated_tickets": 0,
                "ai_resolution_rate": 100.0,
            }


analytics_service = AnalyticsService()
