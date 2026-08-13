from uuid import UUID
from app.services.profile_service import profile_service

def test_get_profile():
    user_id = UUID("11111111-1111-1111-1111-111111111111")
    tenant_id = UUID("11111111-1111-1111-1111-111111111111")

    profile = profile_service.get_profile(user_id=user_id, tenant_id=tenant_id)
    assert isinstance(profile, dict)