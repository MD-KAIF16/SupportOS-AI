"""
=========================================================
File: knowledge_agent.py

Purpose:
Knowledge Agent

Responsibilities:
1. Receive user question
2. Load Digital Twin
3. Load Conversation History
4. Retrieve Knowledge Base Context
5. Build Prompt
6. Generate AI Response
=========================================================
"""

# =========================================================
# Imports
# =========================================================

from langchain_core.tools import tool

from app.agents.state import SupportState
from app.core.logger import logger

from app.services.profile_service import profile_service

from app.services.embedding_service import generate_embedding
from app.services.qdrant_service import search_documents

from app.services.prompt_builder import build_prompt
from app.services.gemini_service import generate_response


# =========================================================
# Tool
# =========================================================

@tool
def get_context(
    query: str,
    tenant_id: str,
):
    """
    Search Qdrant Knowledge Base.
    """

    logger.info("Searching Knowledge Base...")

    embedding = generate_embedding(query)

    documents = search_documents(
        query_embedding=embedding,
        tenant_id=tenant_id,
    )

    return documents


# =========================================================
# Register Tools
# =========================================================

tools = [
    get_context,
]


# =========================================================
# Knowledge Agent
# =========================================================

def knowledge_agent(
    state: SupportState,
) -> SupportState:

    logger.info("Knowledge Agent Started")

    # -----------------------------------------------------
    # Read Shared State
    # -----------------------------------------------------

    tenant_id = state["tenant_id"]
    user_id = state["user_id"]

    question = state["messages"][-1].content

    state["question"] = question

    # -----------------------------------------------------
    # Load User Profile
    # -----------------------------------------------------

    try:

        profile = profile_service.get_profile(
            user_id=user_id,
            tenant_id=tenant_id,
        )

        logger.info(
            "User profile loaded."
        )

    except Exception:

        logger.exception(
            "Failed to load user profile."
        )

        profile = {}

    state["user_profile"] = profile

    # -----------------------------------------------------
    # Conversation History
    # -----------------------------------------------------

    history = state.get("conversation_history", [])

    logger.info(
    f"Using {len(history)} conversation(s) from workflow state."
    )

    # -----------------------------------------------------
    # Retrieve Knowledge Base Context
    # -----------------------------------------------------

    try:

        documents = get_context.invoke(
            {
                "query": question,
                "tenant_id": str(tenant_id),
            }
        )

        logger.info(
            f"Retrieved {len(documents)} document(s) from Qdrant."
        )

    except Exception:

        logger.exception(
            "Knowledge retrieval failed."
        )

        documents = []

    state["documents"] = documents

    # -----------------------------------------------------
    # Build Context
    # -----------------------------------------------------

    if documents:

        context = "\n\n".join(
            document["content"]
            for document in documents
        )

    else:

        context = ""

    state["context"] = context

    logger.info("========== PROMPT DEBUG ==========")
    logger.info(f"History Count: {len(history)}")
    logger.info(history)
    logger.info("==================================")

    # -----------------------------------------------------
    # Build Prompt
    # -----------------------------------------------------

    try:

        prompt = build_prompt(
            question=question,
            profile=profile,
            conversation_history=history,
            documents=documents,
        )

        state["prompt"] = prompt

        logger.info(
            "Prompt built successfully."
        )

    except Exception:

        logger.exception(
            "Prompt builder failed."
        )

        prompt = question

        state["prompt"] = prompt

    # -----------------------------------------------------
    # Generate AI Response
    # -----------------------------------------------------


    try:
        answer = generate_response(
            prompt=prompt,
        )
        logger.info("[CHAT] Gemini response generated successfully.")
    except Exception as exc:
        err_str = str(exc)
        if "429" in err_str or "RESOURCE_EXHAUSTED" in err_str or "503" in err_str:
            logger.warning(f"[CHAT] Gemini generation failed: Rate limit / Quota (429/503)")
            answer = (
                "AI Support is temporarily unavailable due to high demand. Please try again in a moment or submit a support ticket above."
            )
        else:
            logger.exception("[CHAT] Gemini generation failed.")
            answer = (
                "AI Support is temporarily unavailable. Please try again in a moment or submit a support ticket above."
            )


    # -----------------------------------------------------
    # Update Workflow State
    # -----------------------------------------------------

    # Draft answer generated by Knowledge Agent.
    # FollowUp Agent will convert this into the final answer.

    state["draft_answer"] = answer

    state["next_agent"] = "followup_agent"

    logger.info(
        "Knowledge Agent Finished Successfully."
    )

    return state