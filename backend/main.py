from fastapi import FastAPI

app = FastAPI()

@app.get("/")
def home():
    return {
        "message": "SupportOS AI Backend is Running Successfully 🚀"
    }