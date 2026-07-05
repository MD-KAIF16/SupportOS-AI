"""
tests/test_qdrant.py

Purpose
-------
1. Delete old collection
2. Create new collection
3. Create payload index
4. Insert fresh test documents
"""

from app.services.qdrant_service import (
    client,
    COLLECTION_NAME,
    create_collection,
    create_payload_index,
    insert_documents,
)

# ======================================================
# Delete Old Collection
# ======================================================

try:
    client.delete_collection(COLLECTION_NAME)
    print("🗑️ Old collection deleted")

except Exception:
    print("ℹ️ Collection does not exist")


# ======================================================
# Create Collection
# ======================================================

create_collection()


# ======================================================
# Create Payload Index
# ======================================================

create_payload_index()


# ======================================================
# Sample Documents
# ======================================================

documents = [

    """
Password Reset Guide

To reset your password:

1. Open the login page.
2. Click on "Forgot Password".
3. Enter your registered email address.
4. Check your email inbox.
5. Click the reset link.
6. Create a new password.

The reset link remains valid for 30 minutes.
""",

    """
Order Tracking Guide

To track your order:

1. Login to your account.
2. Open Dashboard.
3. Go to My Orders.
4. Click Track Order.

You can view the live delivery status.
""",

    """
Refund Policy

Customers can request a refund within 7 days of delivery.

Conditions:

- Product must be unused.
- Original packaging is required.
- Refunds are processed within 5 business days.
"""
]


# ======================================================
# Insert Documents
# ======================================================

insert_documents(documents)

print("✅ Test data inserted successfully")