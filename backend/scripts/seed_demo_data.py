"""
=========================================================
File: seed_demo_data.py

Purpose:
Idempotent development & production demo data seeder for SupportOS AI.

Architecture & Responsibilities:
1. Creates or verifies confirmed Admin & Customer demo test accounts using Supabase Auth Admin API (bypassing email confirmation rate limits).
2. Populates demo tickets, conversation history, customer profile, and knowledge base documents for tenant '11111111-1111-1111-1111-111111111111'.
3. Automatically vector-indexes Knowledge Base documents into Qdrant using the application's document ingestion service.
4. Idempotent: Can be executed multiple times safely without duplicating demo accounts or resources.

Usage:
python scripts/seed_demo_data.py
=========================================================
"""

import sys
import os
import asyncio
from uuid import UUID

# Add backend directory to sys.path to allow module imports
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.core.logger import logger
from app.core.supabase_client import supabase_db
from app.models.document_models import SupportDocument
from app.services.document_service import create_document_service

DEMO_TENANT_ID = "11111111-1111-1111-1111-111111111111"
ADMIN_EMAIL = "supportos.admin.demo@gmail.com"
ADMIN_PASSWORD = "SupportOSAdmin@2026!"
ADMIN_NAME = "SupportOS Admin Demo"

CUSTOMER_EMAIL = "supportos.customer.demo@gmail.com"
CUSTOMER_PASSWORD = "SupportOSCustomer@2026!"
CUSTOMER_NAME = "SupportOS Customer Demo"


def get_or_create_user(email: str, password: str, name: str, role: str) -> str:
    """
    Get existing user ID or create pre-confirmed user via Supabase Auth Admin API.
    Enforces role mapping in public.users table.
    """
    logger.info(f"Seeding demo user: {email} ({role})")

    # Check if user already exists in public.users
    existing = (
        supabase_db
        .table("users")
        .select("id")
        .eq("email", email)
        .execute()
    )

    user_id = None
    if existing.data and len(existing.data) > 0:
        user_id = existing.data[0]["id"]
        logger.info(f"User {email} already exists in DB with ID {user_id}")
    else:
        # Create pre-confirmed user in Supabase Auth via Admin API
        try:
            auth_user = supabase_db.auth.admin.create_user({
                "email": email,
                "password": password,
                "email_confirm": True,
                "user_metadata": {"full_name": name}
            })
            user_id = str(auth_user.user.id)
            logger.info(f"Created confirmed Supabase Auth user: {user_id}")
        except Exception as e:
            logger.warning(f"Supabase Auth admin create warning for {email}: {e}")
            # Fallback search in auth users list if created previously
            try:
                users_list = supabase_db.auth.admin.list_users()
                for u in users_list:
                    if u.email == email:
                        user_id = str(u.id)
                        break
            except Exception as ex:
                logger.error(f"Failed to resolve auth user ID for {email}: {ex}")

    if not user_id:
        raise RuntimeError(f"Could not create or resolve user ID for {email}")

    # Upsert public.users record
    supabase_db.table("users").upsert({
        "id": user_id,
        "email": email,
        "name": name,
        "role": role,
        "tenant_id": DEMO_TENANT_ID,
    }).execute()

    # Upsert public.user_profiles record
    try:
        supabase_db.table("user_profiles").upsert({
            "id": user_id,
            "user_id": user_id,
            "tenant_id": DEMO_TENANT_ID,
            "full_name": name,
            "email": email,
        }).execute()
    except Exception as ex:
        logger.warning(f"Profile upsert notice: {ex}")

    return user_id


def seed_tickets(customer_id: str):
    """
    Seed 5 realistic support tickets for demo customer.
    """
    logger.info("Seeding realistic demo support tickets...")

    demo_tickets = [
        {
            "title": "Unable to update account email",
            "description": "I tried changing my email address in Account Settings but did not receive the confirmation link.",
            "status": "Open",
            "priority": "High",
        },
        {
            "title": "Billing invoice clarification",
            "description": "Please provide an itemized breakdown for invoice #INV-2026-08.",
            "status": "Pending",
            "priority": "Medium",
        },
        {
            "title": "Cannot access previous conversation",
            "description": "My chat history from yesterday did not load automatically on refresh.",
            "status": "Resolved",
            "priority": "Medium",
        },
        {
            "title": "Password reset assistance",
            "description": "I requested a password reset link but need assistance verifying my security options.",
            "status": "Escalated",
            "priority": "High",
        },
        {
            "title": "General account question",
            "description": "How do I invite additional team members to our workspace?",
            "status": "Resolved",
            "priority": "Low",
        },
    ]

    for ticket_data in demo_tickets:
        # Idempotent check by title and customer_id
        existing = (
            supabase_db
            .table("tickets")
            .select("id")
            .eq("tenant_id", DEMO_TENANT_ID)
            .eq("user_id", customer_id)
            .eq("title", ticket_data["title"])
            .execute()
        )

        if not existing.data or len(existing.data) == 0:
            payload = {
                "user_id": customer_id,
                "tenant_id": DEMO_TENANT_ID,
                "title": ticket_data["title"],
                "description": ticket_data["description"],
                "status": ticket_data["status"],
                "priority": ticket_data["priority"],
            }
            supabase_db.table("tickets").insert(payload).execute()
            logger.info(f"Inserted demo ticket: {ticket_data['title']}")


def seed_conversations(customer_id: str):
    """
    Seed realistic conversation history records.
    """
    logger.info("Seeding demo conversation history...")

    demo_conversations = [
        {
            "question": "How can I update my account email?",
            "answer": "You can update your account email from Account Settings. If the verification email does not arrive, please contact support.",
        },
        {
            "question": "Where can I see my previous support requests?",
            "answer": "You can view your previous support requests from the Support Requests section.",
        },
        {
            "question": "I need help with my billing invoice.",
            "answer": "I can help with billing questions. Please provide the invoice number or create a support request if further investigation is required.",
        },
    ]

    for conv in demo_conversations:
        existing = (
            supabase_db
            .table("conversations")
            .select("id")
            .eq("tenant_id", DEMO_TENANT_ID)
            .eq("user_id", customer_id)
            .eq("question", conv["question"])
            .execute()
        )

        if not existing.data or len(existing.data) == 0:
            payload = {
                "user_id": customer_id,
                "tenant_id": DEMO_TENANT_ID,
                "question": conv["question"],
                "answer": conv["answer"],
            }
            supabase_db.table("conversations").insert(payload).execute()
            logger.info(f"Inserted demo conversation: '{conv['question'][:30]}...'")


async def seed_knowledge_base():
    """
    Seed demo Knowledge Base documents and index into Qdrant.
    """
    logger.info("Seeding Knowledge Base documents into Supabase & Qdrant...")

    docs = [
        {
            "title": "Account Management Guide",
            "content": "To manage your account, navigate to Account Settings. You can update your full name, email preferences, and notification options.",
            "source": "Official Support Guide",
        },
        {
            "title": "Billing & Payments FAQ",
            "content": "Invoices are generated on the 1st of every month. Payments can be reviewed under Billing Settings. Approved refunds are processed within 5 business days.",
            "source": "Finance Policy",
        },
        {
            "title": "Password & Account Recovery Guide",
            "content": "If you forget your password, click Forgot Password on the sign-in page to receive a recovery email. Password reset links expire in 60 minutes.",
            "source": "Security Policy",
        },
        {
            "title": "Support Ticket Policy",
            "content": "High priority issues are assigned to human agents immediately. Standard support requests receive response within 24 hours.",
            "source": "SLA Specification",
        },
    ]

    for d in docs:
        existing = (
            supabase_db
            .table("support_documents")
            .select("id")
            .eq("tenant_id", DEMO_TENANT_ID)
            .eq("title", d["title"])
            .execute()
        )

        if not existing.data or len(existing.data) == 0:
            doc_model = SupportDocument(
                title=d["title"],
                content=d["content"],
                tenant_id=UUID(DEMO_TENANT_ID),
                source=d["source"],
            )
            try:
                await create_document_service(doc_model)
                logger.info(f"Indexed KB document: {d['title']}")
            except Exception as e:
                logger.warning(f"Vector indexing notice for {d['title']}: {e}")


async def main():
    logger.info("=== SupportOS AI Demo Data Seeder Started ===")

    admin_id = get_or_create_user(ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME, "admin")
    customer_id = get_or_create_user(CUSTOMER_EMAIL, CUSTOMER_PASSWORD, CUSTOMER_NAME, "end_user")

    seed_tickets(customer_id)
    seed_conversations(customer_id)
    await seed_knowledge_base()

    logger.info("=== SupportOS AI Demo Data Seeder Completed Successfully ===")
    print("\nDEMO DATA SEEDED SUCCESSFULLY!")
    print(f"Tenant ID: {DEMO_TENANT_ID}")
    print(f"Admin User ID: {admin_id} ({ADMIN_EMAIL})")
    print(f"Customer User ID: {customer_id} ({CUSTOMER_EMAIL})")


if __name__ == "__main__":
    asyncio.run(main())
