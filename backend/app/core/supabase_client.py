"""
=========================================================
File: supabase_client.py

Purpose:
Initialize Supabase client for backend services.
=========================================================
"""

from supabase import Client, create_client

from app.core.config import (
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)

supabase: Client = create_client(
    SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY,
)