# ======================================================
# SupportOS AI Backend
# ======================================================

import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.auth import router as auth_router
from app.routers.chat import router as chat_router
from app.routers.documents import router as documents_router
from app.routers.profile import router as profile_router
from app.routers.tickets import router as tickets_router
from app.routers.user import router as user_router
from app.routers.analytics import router as analytics_router
from app.routers.admin import router as admin_router
from app.core.exception_handler import register_exception_handlers

# ======================================================
# FastAPI App
# ======================================================

app = FastAPI(
    title="SupportOS AI Backend",
    version="1.0.0",
)

register_exception_handlers(app)

# ======================================================
# CORS
# ======================================================

allowed_origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

env_origins = os.getenv("ALLOWED_ORIGINS") or os.getenv("FRONTEND_URL")
if env_origins:
    for origin in env_origins.split(","):
        stripped = origin.strip()
        if stripped and stripped not in allowed_origins:
            allowed_origins.append(stripped)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins if not os.getenv("ALLOW_ALL_CORS") else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# Routers
# ======================================================

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(profile_router)
app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(tickets_router)
app.include_router(analytics_router)
app.include_router(admin_router)


# ======================================================
# Health & Home Endpoints
# ======================================================

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "SupportOS AI Backend",
        "version": "1.0.0",
    }


@app.get("/")
def home():
    return {
        "message": "SupportOS AI Backend is Running Successfully 🚀"
    }