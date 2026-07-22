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

    state = {
        "messages": [
            HumanMessage(content=question)
        ],
        "question": question,
        "user_id": str(user_id),
        "tenant_id": str(tenant_id),
        "documents": [],
        "context": "",
        "conversation_history": [],
        "user_profile": {},
        "prompt": "",
        "draft_answer": "",
        "final_answer": "",
        "next_agent": "",
        "error": None,
    }

    result = graph.invoke(state)

    logger.info("Workflow completed.")

    reply = result["final_answer"]

    try:
        conversation_service.save_conversation(
            user_id=user_id,
            tenant_id=tenant_id,
            question=question,
            answer=reply,
        )

        logger.info("Conversation saved successfully.")

    except Exception as e:
        logger.exception(f"Failed to save conversation: {e}")

    return {
        "reply": reply,
        "documents": result.get("documents", []),
    }