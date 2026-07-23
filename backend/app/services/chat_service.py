from uuid import UUID

from langchain_core.messages import HumanMessage

from app.agents.graph import graph
from app.core.logger import logger
from app.services.conversation_service import conversation_service


def chat_with_ai(
    question: str,
    user_id: UUID,
    tenant_id: UUID,
) -> dict:
    """
    Execute LangGraph workflow and return AI response.
    """

    logger.info("Starting LangGraph workflow...")

    # =====================================================
    # Load Previous Conversation History
    # =====================================================

    logger.info("Loading conversation history...")

    conversation_history = (
        conversation_service.get_recent_conversations(
            user_id=user_id,
            tenant_id=tenant_id,
            limit=5,
        )
    )

    logger.info(
        f"Conversation history loaded: {len(conversation_history)}"
    )

    # =====================================================
    # Build LangGraph State
    # =====================================================

    state = {
        "messages": [
            HumanMessage(content=question)
        ],
        "question": question,
        "user_id": str(user_id),
        "tenant_id": str(tenant_id),

        # RAG
        "documents": [],
        "context": "",

        # Long-Term Memory
        "conversation_history": conversation_history,

        # Digital Twin
        "user_profile": {},

        # Prompt
        "prompt": "",

        # Workflow
        "draft_answer": "",
        "final_answer": "",
        "next_agent": "",

        # Error Handling
        "error": None,
    }

    # =====================================================
    # Execute LangGraph
    # =====================================================

    result = graph.invoke(state)

    logger.info("Workflow completed.")

    reply = result["final_answer"]

    # =====================================================
    # Save Current Conversation
    # =====================================================

    try:

        conversation_service.save_conversation(
            user_id=user_id,
            tenant_id=tenant_id,
            question=question,
            answer=reply,
        )

        logger.info("Conversation saved successfully.")

    except Exception as e:

        logger.exception(
            f"Failed to save conversation: {e}"
        )

    # =====================================================
    # Return Response
    # =====================================================

    return {
        "reply": reply,
        "documents": result.get("documents", []),
    }