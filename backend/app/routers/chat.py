from fastapi import APIRouter
from pydantic import BaseModel

from app.services.gemini import client

router = APIRouter(
    tags=["Chat"]
)


class ChatRequest(BaseModel):
    message: str


@router.post("/chat")
async def chat(request: ChatRequest):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=request.message
    )

    return {
        "reply": response.text
    }