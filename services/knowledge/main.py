from fastapi import FastAPI, Depends, HTTPException
from pydantic import BaseModel
from typing import Optional
from services.shared.models import MemoryBlock, MemoryType, BrainScope
from services.shared.database import get_neo4j_session
from neo4j import Session
import uuid
import logging

logger = logging.getLogger(__name__)

app = FastAPI(title="Knowledge Service", version="1.0.0")

class KnowledgePayload(BaseModel):
    content: str
    brain_scope: BrainScope
    source_type: str
    tags: list[str] = []
    source_url: Optional[str] = None  # For URLs and YouTube videos

@app.post("/add")
async def add_knowledge(payload: KnowledgePayload, session: Session = Depends(get_neo4j_session)):
    """
    Core Logic: Entity extraction, topic classification, and graph insertion.
    """
    logger.info(f"[KNOWLEDGE] Received payload: scope={payload.brain_scope}, source={payload.source_type}, content_length={len(payload.content)}")
    
    # 1. Extract metadata (entities, topics)
    from services.shared.metadata import metadata_extractor
    entities, topics = await metadata_extractor.extract_metadata(payload.content)
    logger.info(f"[KNOWLEDGE] Extracted {len(entities)} entities: {entities[:5]}")
    logger.info(f"[KNOWLEDGE] Extracted {len(topics)} topics: {topics}")
    
    # 2. Generate Embedding for vector search
    from services.shared.embeddings import embedding_service
    embedding = embedding_service.generate_embedding(payload.content)
    logger.info(f"[KNOWLEDGE] Generated embedding of length: {len(embedding) if embedding else 0}")
    
    # 3. Create Node in Neo4j with all properties
    node_id = str(uuid.uuid4())
    logger.info(f"[KNOWLEDGE] Creating Neo4j node with ID: {node_id}")
    
    # Simple Cypher to Create Memory node with its metadata
    # We store the embedding as a list of floats (Neo4j supports this)
    query = """
    CREATE (m:Memory {
        id: $id,
        content: $content,
        source_type: $source_type,
        source_url: $source_url,
        scope: $scope,
        entities: $entities,
        topics: $topics,
        embedding: $embedding,
        created_at: datetime()
    })
    RETURN m.id
    """
    
    session.run(query, 
        id=node_id, 
        content=payload.content, 
        source_type=payload.source_type,
        source_url=payload.source_url,
        scope=payload.brain_scope,
        entities=entities,
        topics=topics,
        embedding=embedding
    )
    
    logger.info(f"[KNOWLEDGE] Successfully created node {node_id} in Neo4j")
    return {"status": "processed", "node_id": node_id, "resolution": "created_new"}

@app.get("/knowledge/search")
async def search_knowledge(
    query: str = "",
    tags: str = "",
    brain_scope: Optional[str] = None,
    limit: int = 10,
    session: Session = Depends(get_neo4j_session)
):
    """
    Search knowledge base using semantic similarity.
    """
    results = []
    
    try:
        # Generate embedding for query
        from services.shared.embeddings import embedding_service
        query_embedding = embedding_service.generate_embedding(query) if query else []
        
        # Build Cypher query for semantic search
        # Since we are using a local Neo4j without a dedicated vector index plugin for now,
        # we'll do a simple cosine similarity in Cypher if possible, 
        # or just fetch and rank in Python for small datasets.
        # For production demo, we'll use a Cypher-based similarity if embeddings are small.
        
        # Fallback: Tag-based search if no query, else semantic
        if query and query_embedding:
            # Vector search using cosine similarity in Cypher
            cypher = """
            MATCH (m:Memory)
            WHERE m.embedding IS NOT NULL
            WITH m, 
                 reduce(dot = 0.0, i IN range(0, size(m.embedding)-1) | dot + m.embedding[i] * $query_emb[i]) /
                 (sqrt(reduce(l2 = 0.0, i IN range(0, size(m.embedding)-1) | l2 + m.embedding[i] * m.embedding[i])) * 
                sqrt(reduce(l2 = 0.0, i IN range(0, size($query_emb)-1) | l2 + $query_emb[i] * $query_emb[i]))) AS similarity
            WHERE similarity > 0.25
            RETURN m.id as id, m.content as content, m.source_type as source_type, m.scope as scope, 
                   m.tags as tags, toString(m.created_at) as created_at, similarity
            ORDER BY similarity DESC
            LIMIT $limit
            """
            result = session.run(cypher, {"limit": limit, "query_emb": query_embedding})
            
            for record in result:
                results.append({
                    "id": record["id"],
                    "content": record["content"],
                    "source_type": record["source_type"],
                    "scope": record["scope"],
                    "tags": record["tags"] or [],
                    "created_at": record["created_at"],
                    "similarity": record["similarity"]
                })
        else:
            # Fallback to recent if no query
            query_recent = """
            MATCH (m:Memory)
            RETURN m.id as id, m.content as content, m.source_type as source_type, 
                   m.scope as scope, m.tags as tags, toString(m.created_at) as created_at
            ORDER BY m.created_at DESC
            LIMIT $limit
            """
            result = session.run(query_recent, {"limit": limit})
            for record in result:
                results.append({
                    "id": record["id"],
                    "content": record["content"],
                    "source_type": record["source_type"],
                    "scope": record["scope"],
                    "tags": record["tags"] or [],
                    "created_at": record["created_at"]
                })
        
        return results
        
    except Exception as e:
        logger.error(f"Search failed: {e}")
        raise HTTPException(status_code=500, detail=f"Search error: {str(e)}")

@app.get("/search")
def search_knowledge(tags: str, session: Session = Depends(get_neo4j_session)):
    """
    Search memories by tags (comma separated). Excludes soft-deleted items.
    """
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    
    # Updated query to exclude deleted items
    query = """
    MATCH (m:Memory)
    WHERE (any(input_tag IN $tags WHERE input_tag IN m.tags))
    AND (m.is_deleted IS NULL OR m.is_deleted = false)
    RETURN m.id as id, m.content as content, m.tags as tags, m.created_at as toString(m.created_at)
    LIMIT 20
    """
    
    result = session.run(query, {"tags": tag_list})
    return [record.data() for record in result]

@app.delete("/{node_id}")
def delete_knowledge(node_id: str, session: Session = Depends(get_neo4j_session)):
    """
    Soft delete a memory node (Archive).
    """
    query = """
    MATCH (m:Memory {id: $node_id})
    SET m.is_deleted = true, m.deleted_at = localdatetime()
    RETURN m.id as id
    """
    result = session.run(query, {"node_id": node_id})
    
    if result.peek() is None:
         raise HTTPException(status_code=404, detail="Memory not found")
        
    return {"status": "soft_deleted", "id": node_id}


@app.post("/merge")
def merge_knowledge(node_ids: list[str], target_content: str, session: Session = Depends(get_neo4j_session)):
    """
    Merging multiple nodes into a single 'Summary' node.
    The original nodes are linked to the new Summary node via 'MERGED_INTO' relationship.
    And optionally soft-deleted or kept as history.
    """
    if len(node_ids) < 2:
        raise HTTPException(status_code=400, detail="Need at least 2 nodes to merge.")
    
    # Logic:
    # 1. Create new Summary Node
    # 2. Create relationships FROM old nodes TO new node
    # 3. Soft delete old nodes (optional, but requested behavior implies replacing)
    
    query = """
    CREATE (s:Memory {
        id: $new_id,
        content: $content,
        created_at: localdatetime(),
        type: 'summary',
        tags: ['merged_summary'] 
    })
    WITH s
    UNWIND $old_ids as old_id
    MATCH (old:Memory {id: old_id})
    MERGE (old)-[:MERGED_INTO]->(s)
    SET old.is_archived = true
    RETURN s.id
    """
    # Note: We used 'is_archived' here to distinguish from 'is_deleted' (trash).
    
    new_id = str(uuid.uuid4())
    session.run(query, {
        "new_id": new_id,
        "content": target_content,
        "old_ids": node_ids
    })
    
    return {"status": "merged", "new_summary_id": new_id, "merged_count": len(node_ids)}

@app.get("/recent")
def get_recent_knowledge(limit: int = 50, session: Session = Depends(get_neo4j_session)):
    """
    Get the most recently created nodes for System Logs.
    """
    query = """
    MATCH (m:Memory)
    WHERE (m.is_deleted IS NULL OR m.is_deleted = false)
    RETURN m.id as id, m.content as content, m.tags as tags, 
           m.scope as scope, m.source_type as source_type,
           m.source_url as source_url,
           m.entities as entities, m.topics as topics,
           toString(m.created_at) as created_at
    ORDER BY m.created_at DESC
    LIMIT $limit
    """
    result = session.run(query, {"limit": limit})
    return [record.data() for record in result]

def _get_embedding_stub(text: str):


    """
    Returns a fake vector.
    TODO: Use SentenceTransformers or OpenAI.
    """
    return [0.1] * 768
