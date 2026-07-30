import os
from dotenv import load_dotenv
from google import genai
from pinecone import Pinecone, ServerlessSpec
from rules import global_brand_rules
from app.config import genai_client, pinecone_client
load_dotenv()

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")
PINECONE_API_KEY = os.getenv("PINECONE_API_KEY")
INDEX_NAME = os.getenv("PINECONE_INDEX_NAME", "samsung-brand-guard")

if not GEMINI_API_KEY or not PINECONE_API_KEY:
    raise ValueError("Missing GEMINI_API_KEY or PINECONE_API_KEY in environment variables.")


def setup_vector_database():
    print(f"Checking Pinecone index: '{INDEX_NAME}'...")
    existing_indexes = [i.name for i in pinecone_client.list_indexes()]
    
    if INDEX_NAME not in existing_indexes:
        print(f"Creating new serverless index '{INDEX_NAME}' (dimension: 3072)...")
        pinecone_client.create_index(
            name=INDEX_NAME,
            dimension=3072,  # text-embedding-004 output dimension size
            metric="cosine",
            spec=ServerlessSpec(cloud="aws", region="us-east-1")
        )
        print("Index created successfully.")
    else:
        print("Index already exists.")

    index = pinecone_client.Index(INDEX_NAME)

    print("Generating embeddings via Gemini and upserting into Pinecone...")
    vectors_to_upsert = []

    for item in global_brand_rules:
        # Generate text embedding using Gemini SDK
        response = genai_client.models.embed_content(
            model="models/gemini-embedding-001",
            contents=item["text"]
        )
        vector_values = response.embeddings[0].values

        vectors_to_upsert.append({
            "id": item["id"],
            "values": vector_values,
            "metadata": {
                "rule_name": item["rule_name"],
                "text": item["text"]
            }
        })

    # Upsert batch into Pinecone
    index.upsert(vectors=vectors_to_upsert)
    print(f"Successfully ingested {len(vectors_to_upsert)} brand compliance rules into Pinecone vector storage.")

if __name__ == "__main__":
    setup_vector_database()