"""
=========================================================
File: prompt_builder.py

Purpose:
Build dynamic prompt for Gemini.

Responsibilities:
1. Add user profile
2. Add conversation history
3. Add retrieved documents
4. Add current question
5. Return final prompt
=========================================================
"""

from typing import Any


def build_prompt(
    question: str,
    profile: dict[str, Any] | None,
    conversation_history: list[dict],
    documents: list[dict],
) -> str:
    """
    Build final prompt for Gemini.
    """

    # =====================================================
    # User Profile
    # =====================================================

    if profile:

        profile_text = f"""
User Profile

Name: {profile.get("full_name", "Unknown")}
Email: {profile.get("email", "Unknown")}
"""

    else:

        profile_text = "User Profile\nNo profile available."

    # =====================================================
    # Conversation History
    # =====================================================

    if conversation_history:

        history = []

        for chat in conversation_history:

            history.append(
                f"""
User: {chat.get("question","")}
Assistant: {chat.get("answer","")}
"""
            )

        history_text = "\n".join(history)

    else:

        history_text = "No previous conversation."

    # =====================================================
    # Retrieved Knowledge
    # =====================================================

    if documents:

        knowledge = []

        for doc in documents:

            knowledge.append(doc["content"])

        knowledge_text = "\n\n".join(knowledge)

    else:

        knowledge_text = "No relevant knowledge found."

    # =====================================================
    # Final Prompt
    # =====================================================

    prompt = f"""
You are SupportOS AI.

You are an intelligent customer support assistant.

Always use the retrieved knowledge whenever available.

If the answer is not present inside the knowledge,
say:

"I couldn't find that information in the knowledge base."

--------------------------------------------------

{profile_text}

--------------------------------------------------

Previous Conversation

{history_text}

--------------------------------------------------

Knowledge Base

{knowledge_text}

--------------------------------------------------

Current User Question

{question}

--------------------------------------------------

Provide a clear, professional and concise answer.
"""

    return prompt