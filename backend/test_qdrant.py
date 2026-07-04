from app.services.qdrant_service import (
    create_collection,
    insert_documents,
)

create_collection()

documents = [
    "How to reset password?",
    "Refund policy is 7 days.",
    "Track your order from dashboard.",
]

insert_documents(documents)