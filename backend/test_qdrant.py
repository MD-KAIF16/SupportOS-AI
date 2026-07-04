from app.services.qdrant_service import (
    create_collection,
    create_payload_index,
    insert_documents,
)

create_collection()

create_payload_index()

documents = [
    "How to reset password?",
    "Refund policy is 7 days.",
    "Track your order from dashboard.",
]

insert_documents(
    documents,
    tenant_id="tenant_1",
)