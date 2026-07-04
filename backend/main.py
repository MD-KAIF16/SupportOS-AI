# ======================================================
# SupportOS AI Backend
# Main Application
# ======================================================

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routers.chat import router as chat_router
from app.routers.user import router as user_router

# ======================================================
# Create FastAPI App
# ======================================================

app = FastAPI()

# ======================================================
# CORS Configuration
# Allows Frontend (Next.js) to communicate with Backend
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
# Register Routers
# ======================================================

app.include_router(chat_router)
app.include_router(user_router)

# ======================================================
# Home Route
# ======================================================

@app.get("/")
def home():
    return {
        "message": "SupportOS AI Backend is Running Successfully 🚀"
    }