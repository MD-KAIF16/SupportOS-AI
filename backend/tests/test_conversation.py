from uuid import UUID
from app.services.conversation_service import conversation_service

def test_get_recent_conversations():
    user_id = UUID("11111111-1111-1111-1111-111111111111")
    tenant_id = UUID("11111111-1111-1111-1111-111111111111")

    history = conversation_service.get_recent_conversations(
        user_id=user_id,
        tenant_id=tenant_id,
        limit=5,
    )
    assert isinstance(history, list)