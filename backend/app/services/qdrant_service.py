import uuid
from qdrant_client.models import Filter

from qdrant_client import QdrantClient
from qdrant_client.models import (
    Distance,
    VectorParams,
    PointStruct,
)

from app.core.config import (
    QDRANT_URL,
    QDRANT_API_KEY,
)

from app.services.gemini import get_embedding


# Connect to Qdrant Cloud
client = QdrantClient(
    url=QDRANT_URL,
    api_key=QDRANT_API_KEY,
)

COLLECTION_NAME = "support_docs"


# Create collection if not exists
def create_collection():

    collections = client.get_collections().collections

    names = [collection.name for collection in collections]

    if COLLECTION_NAME not in names:

        # Get embedding dimension automatically
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


# Insert documents into Qdrant
def insert_documents(documents: list[str]):

    points = []

    for doc in documents:

        embedding = get_embedding(doc)

        points.append(
            PointStruct(
                id=str(uuid.uuid4()),
                vector=embedding,
                payload={
                    "text": doc,
                },
            )
        )

    client.upsert(
        collection_name=COLLECTION_NAME,
        points=points,
    )

    print("✅ Documents Inserted Successfully")

# Search similar documents
def search_documents(query: str, limit: int = 3):

    query_vector = get_embedding(query)

    results = client.query_points(
        collection_name=COLLECTION_NAME,
        query=query_vector,
        limit=limit,
    )

    return results.points