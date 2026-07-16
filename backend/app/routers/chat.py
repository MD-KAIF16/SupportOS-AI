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
=========================================================
"""

from fastapi import APIRouter
from langchain_core.messages import HumanMessage

from app.models.chat_models import (
    ChatRequest,
    ChatResponse,
)

from app.models.response_model import APIResponse

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

    # -----------------------------------------------------
    # Create Shared State
    # -----------------------------------------------------

    state = {

        # Conversation History
        "messages": [
            HumanMessage(content=request.message)
        ],

        # User Information
        "tenant_id": request.tenant_id,
        "user_id": request.user_id,

        # User Question
        "question": "",

        # Digital Twin
        "user_profile": {},

        # Retrieved Context
        "context": "",
        "documents": [],

        # AI Responses
        "draft_answer": "",
        "final_answer": "",

        # Workflow
        "next_agent": "knowledge_agent",
    }

    print("\n🚀 Starting LangGraph Workflow...")

    # -----------------------------------------------------
    # Execute Workflow
    # -----------------------------------------------------

    result = graph.invoke(state)

    print("✅ Workflow Finished")

    # -----------------------------------------------------
    # Return API Response
    # -----------------------------------------------------

    return APIResponse(
        success=True,
        message="Chat generated successfully.",
        data=ChatResponse(
            reply=result["final_answer"],
            documents=result["documents"],
        ),
    )