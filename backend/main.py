from fastapi import FastAPI
from pydantic import BaseModel

# FastAPI Application
app = FastAPI()


# Pydantic Model
class EchoRequest(BaseModel):
    message: str


# Home Route
@app.get("/")
def home():
    return {
        "message": "SupportOS AI Backend is Running Successfully 🚀"
    }


# Echo Route
@app.post("/echo")
def echo(request: EchoRequest):
    return {
        "echo": request.message
    }