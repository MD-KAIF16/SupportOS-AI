from fastapi import FastAPI

from app.routers.chat import router as chat_router
from app.routers.user import router as user_router

app = FastAPI()

app.include_router(chat_router)
app.include_router(user_router)


@app.get("/")
def home():
    return {
        "message": "SupportOS AI Backend is Running Successfully 🚀"
    }