"""
=========================================================
File: chat.py

Purpose:
Chat API Router

Responsibilities:
1. Receive chat request
2. Create shared state
3. Execute LangGraph
4. Return API response

Flow

Frontend
      │
      ▼
POST /chat
      │
      ▼
graph.invoke()
      │
      ▼
Orchestrator
      │
      ▼
Knowledge Agent
      │
      ▼
Judge Agent
      │
      ▼
API Response
=========================================================
"""

from fastapi import APIRouter

from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
)

from app.models.response_model import APIResponse

# LangGraph Workflow
from app.agents.graph import graph

router = APIRouter(
    prefix="/chat",
    tags=["Chat"],
)


# =========================================================
# Chat Endpoint
# =========================================================

@router.post(
    "",
    response_model=APIResponse,
)
def chat(request: ChatRequest):

    # -----------------------------------------
    # Create Shared State
    # -----------------------------------------

    state = {
        "tenant_id": request.tenant_id,
        "question": request.message,
        "context": "",
        "documents": [],
        "draft_answer": "",
        "final_answer": "",
    }

    # -----------------------------------------
    # Execute Multi-Agent Workflow
    # -----------------------------------------

    result = graph.invoke(state)

    # -----------------------------------------
    # Return Final Response
    # -----------------------------------------

    return APIResponse(
        success=True,
        message="Chat generated successfully.",
        data=ChatResponse(
            reply=result["final_answer"],
            documents=result["documents"],
        ),
    )