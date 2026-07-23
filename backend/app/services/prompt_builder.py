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
    Build the final prompt for Gemini.
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

        profile_text = """
User Profile

No profile available.
"""

    # =====================================================
    # Conversation History
    # =====================================================

    if conversation_history:

        history = []

        for chat in conversation_history:

            history.append(
                f"""
User: {chat.get("question", "")}
Assistant: {chat.get("answer", "")}
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

            knowledge.append(
                doc.get("content", "")
            )

        knowledge_text = "\n\n".join(knowledge)

    else:

        knowledge_text = "No relevant knowledge found."

    # =====================================================
    # Final Prompt
    # =====================================================

    prompt = f"""
You are SupportOS AI.

You are an intelligent AI customer support assistant.

==================================================
INSTRUCTIONS
==================================================

You have THREE sources of information:

1. USER PROFILE
   - Use for user identity and profile information.

2. PREVIOUS CONVERSATION
   - Use this when the user asks about something they
     previously told you.
   - Examples:
       - What is my name?
       - Where do I live?
       - What is my favourite color?
       - What did I tell you earlier?
   - Use the previous conversation as memory for these questions.

3. KNOWLEDGE BASE
   - Use ONLY for company, product, support,
     documentation and business related questions.
   - Examples:
       - Refund Policy
       - Password Reset
       - Subscription
       - Tickets
       - Features

IMPORTANT:

- Do NOT ignore Previous Conversation for memory questions.

- Do NOT use the Knowledge Base for personal memory questions.

- Only respond with:

"I couldn't find that information in the knowledge base."

when the user is asking about company/product/support
information and the answer does not exist in the Knowledge Base.

- Never invent information.

- If the answer exists in Previous Conversation,
use it confidently.

==================================================
USER PROFILE
==================================================

{profile_text}

==================================================
PREVIOUS CONVERSATION
==================================================

{history_text}

==================================================
KNOWLEDGE BASE
==================================================

{knowledge_text}

==================================================
CURRENT USER QUESTION
==================================================

{question}

==================================================
FINAL RESPONSE
==================================================

First determine whether the user's question is:

(A) A personal memory question
→ Use Previous Conversation.

(B) A support/company question
→ Use Knowledge Base.

(C) A profile question
→ Use User Profile.

Then answer professionally, clearly and naturally.
"""

    return prompt