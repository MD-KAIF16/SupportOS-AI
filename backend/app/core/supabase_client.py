"""
=========================================================
File: supabase_client.py
=========================================================
"""

from supabase import Client, create_client

from app.core.config import (
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
    SUPABASE_SERVICE_ROLE_KEY,
)

# Authentication Client
supabase_auth: Client = create_client(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY,
)

# Database Client
supabase_db: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)

# Backward compatibility
supabase = supabase_db