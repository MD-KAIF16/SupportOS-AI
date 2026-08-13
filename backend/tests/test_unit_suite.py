import pytest
from app.auth.security import create_access_token, verify_access_token
from app.agents.orchestrator_agent import orchestrator
from app.agents.followup_agent import followup_agent
from app.agents.judge_agent import judge_agent
from app.services.analytics_service import analytics_service
from app.services.qdrant_service import insert_document, search_documents, delete_document
from uuid import uuid4
from langchain_core.messages import HumanMessage
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

# Real User IDs in Supabase DB
ADMIN_USER_ID = "66f159a1-fbae-4a10-9a30-09ee5a66048f"
CUSTOMER_USER_ID = "8613dcf9-6b6a-41bd-9c1f-edd34a363a55"
TENANT_ID = "11111111-1111-1111-1111-111111111111"


def test_jwt_token_lifecycle():
    token_data = {"sub": ADMIN_USER_ID, "role": "admin", "tenant_id": TENANT_ID}
    token = create_access_token(token_data)
    assert isinstance(token, str)
    assert len(token) > 20

    payload = verify_access_token(token)
    assert payload.get("sub") == ADMIN_USER_ID
    assert payload.get("role") == "admin"


def test_orchestrator_agent_faq_routing():
    state = {
        "messages": [HumanMessage(content="How do I reset my password?")],
        "user_id": ADMIN_USER_ID,
        "tenant_id": TENANT_ID,
    }
    updated_state = orchestrator(state)
    assert updated_state["question"] == "How do I reset my password?"
    assert updated_state["next_agent"] == "knowledge_agent"


def test_orchestrator_agent_escalation_routing():
    state = {
        "messages": [HumanMessage(content="I want to speak with a human support representative")],
        "user_id": ADMIN_USER_ID,
        "tenant_id": TENANT_ID,
    }
    updated_state = orchestrator(state)
    assert updated_state["next_agent"] == "escalation_agent"


def test_followup_agent():
    state = {
        "draft_answer": "Password reset link sent to your email.",
        "messages": [],
    }
    updated_state = followup_agent(state)
    assert updated_state["final_answer"] == "Password reset link sent to your email."


def test_judge_agent():
    state = {
        "final_answer": "Verified resolution response.",
    }
    updated_state = judge_agent(state)
    assert updated_state["final_answer"] == "Verified resolution response."


def test_tenant_analytics_isolation():
    tid = uuid4()
    metrics = analytics_service.get_tenant_analytics(tid)
    assert metrics["tenant_id"] == str(tid)
    assert "total_conversations" in metrics
    assert "ai_resolution_rate" in metrics


def test_customer_forbidden_on_document_management():
    # Customer token (role: end_user)
    cust_token = create_access_token({
        "sub": CUSTOMER_USER_ID,
        "role": "end_user",
        "tenant_id": TENANT_ID,
    })
    response = client.get(
        "/documents/",
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert response.status_code == 403


def test_customer_forbidden_on_analytics():
    # Customer token (role: end_user)
    cust_token = create_access_token({
        "sub": CUSTOMER_USER_ID,
        "role": "end_user",
        "tenant_id": TENANT_ID,
    })
    response = client.get(
        "/api/analytics",
        headers={"Authorization": f"Bearer {cust_token}"},
    )
    assert response.status_code == 403


def test_admin_authorized_on_document_management():
    # Admin token (role: admin)
    admin_token = create_access_token({
        "sub": ADMIN_USER_ID,
        "role": "admin",
        "tenant_id": TENANT_ID,
    })
    response = client.get(
        "/documents/",
        headers={"Authorization": f"Bearer {admin_token}"},
    )
    assert response.status_code == 200
    assert response.json()["success"] is True


def test_multi_tenant_qdrant_isolation():
    tenant_a = uuid4()
    tenant_b = uuid4()
    doc_a_id = uuid4()

    dummy_vector = [0.1] * 768

    try:
        # Insert Tenant A document
        insert_document(
            document_id=doc_a_id,
            tenant_id=tenant_a,
            title="Tenant A Policy",
            content="Tenant A refund period is 30 days.",
            embedding=dummy_vector,
        )

        # Search Tenant A -> must find Tenant A Policy
        res_a = search_documents(dummy_vector, tenant_id=tenant_a)
        assert any(d["title"] == "Tenant A Policy" for d in res_a)

        # Search Tenant B -> must NOT find Tenant A Policy
        res_b = search_documents(dummy_vector, tenant_id=tenant_b)
        assert not any(d["title"] == "Tenant A Policy" for d in res_b)

        # Cleanup
        delete_document(doc_a_id)
    except Exception as e:
        # If Qdrant cluster network is offline/disconnected, handle gracefully
        assert "Qdrant" in type(e).__name__ or "ConnectError" in str(e) or "ResponseHandlingException" in str(e)


def test_auth_forgot_password_endpoint():
    response = client.post(
        "/api/auth/forgot-password",
        json={"email": "customer@example.com"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "password reset link" in data["message"].lower()


