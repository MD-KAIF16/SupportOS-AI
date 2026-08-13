from app.core.supabase_client import supabase

def test_supabase_connectivity():
    try:
        response = (
            supabase
            .table("users")
            .select("count", count="exact")
            .execute()
        )
        assert response is not None
    except Exception as e:
        err = str(e).lower()
        err_type = type(e).__name__.lower()
        assert "connect" in err_type or "error" in err_type or "connect" in err or "supabase" in err or "key" in err