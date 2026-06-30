import os

from dotenv import load_dotenv
from fastapi import FastAPI
from google import genai
from pydantic import BaseModel


# Load Environment Variables
load_dotenv()


# Create Gemini Client
client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


# Create FastAPI App
app = FastAPI()


# -------------------------
# Request Models
# -------------------------

class EchoRequest(BaseModel):
    message: str


class ChatRequest(BaseModel):
    message: str


# -------------------------
# Routes
# -------------------------

@app.get("/")
def home():
    return {
        "message": "SupportOS AI Backend is Running Successfully 🚀"
    }


@app.post("/echo")
def echo(request: EchoRequest):
    return {
        "echo": request.message
    }


@app.post("/chat")
def chat(request: ChatRequest):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=request.message
    )

    return {
        "reply": response.text
    }