from app.core.supabase_client import supabase

def test_supabase_connectivity():
    response = (
        supabase
        .table("users")
        .select("count", count="exact")
        .execute()
    )
    assert response is not None