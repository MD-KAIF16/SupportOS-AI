# ======================================================
# SupportOS AI Backend
# ======================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware


from app.routers.chat import router as chat_router
from app.routers.documents import router as documents_router
from app.core.exception_handler import register_exception_handlers
from app.routers.profile import router as profile_router

app = FastAPI(
    title="SupportOS AI Backend",
    version="1.0.0",
)
register_exception_handlers(app)

# ======================================================
# CORS
# ======================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ======================================================
# Routers
# ======================================================

app.include_router(documents_router)
app.include_router(chat_router)
app.include_router(profile_router)

# ======================================================
# Home
# ======================================================

@app.get("/")
def home():
    return {
        "message": "SupportOS AI Backend is Running Successfully 🚀"
    }