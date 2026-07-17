from app.core.supabase_client import supabase

response = (
    supabase
    .table("support_documents")
    .select("*")
    .limit(1)
    .execute()
)

print(response)