from app.services.conversation_service import conversation_service

user_id = "11111111-1111-1111-1111-111111111111"

history = conversation_service.get_recent_conversations(user_id)

print("\nConversation History")
print("-" * 50)

for chat in history:
    print(f"Question : {chat['question']}")
    print(f"Answer   : {chat['answer']}")
    print(f"Created  : {chat['created_at']}")
    print("-" * 50)