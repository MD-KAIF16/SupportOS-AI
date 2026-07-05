import uuid
from qdrant_client.models import PayloadSchemaType
from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
    Filter,
    FieldCondition,
    MatchValue,
)

from app.core.config import (
    QDRANT_URL,
    QDRANT_API_KEY,
)

from app.services.gemini_service import get_embedding


# ======================================================
# Qdrant Client
# ======================================================

client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

COLLECTION_NAME = "support_docs"


# ======================================================
# Create Collection
# ======================================================

def create_collection():

    collections = client.get_collections().collections
    names = [collection.name for collection in collections]

    if COLLECTION_NAME not in names:

        vector_size = len(get_embedding("hello"))

        client.create_collection(
            collection_name=COLLECTION_NAME,
            vectors_config=VectorParams(
                size=vector_size,
                distance=Distance.COSINE,
            ),
        )

        print("✅ Collection Created")

    else:

        print("✅ Collection Already Exists")


# ======================================================
# Insert Documents
# ======================================================

def insert_documents(
    documents: list[str],
    tenant_id: str = "tenant_1",
):

    points = []

    for doc in documents:

        embedding = get_embedding(doc)

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": doc,
                    "tenant_id": tenant_id,
                },
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    print("✅ Documents Inserted Successfully")


# ======================================================
# Search Documents
# ======================================================

def search_documents(
    query: str,
    tenant_id: str,
    limit: int = 3,
):

    query_vector = get_embedding(query)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=limit,
        query_filter=Filter(
            must=[
                FieldCondition(
                    key="tenant_id",
                    match=MatchValue(value=tenant_id),
                )
            ]
        ),
    )

    documents = []

    for point in results.points:

        documents.append(
            {
                "text": point.payload["text"],
                "score": round(point.score, 4),
            }
        )

    return documents 


def create_payload_index():

    client.create_payload_index(
        collection_name=COLLECTION_NAME,
        field_name="tenant_id",
        field_schema=PayloadSchemaType.KEYWORD,
    )

    print("✅ tenant_id payload index created")