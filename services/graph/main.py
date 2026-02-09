from fastapi import FastAPI, Depends
from services.shared.database import get_neo4j_session
from neo4j import Session
import logging

app = FastAPI(title="Graph Service", version="1.0.0")
logger = logging.getLogger(__name__)

@app.get("/graph/nodes")
async def get_graph_nodes(
    limit: int = 100,
    scope: str = None,
    session: Session = Depends(get_neo4j_session)
):
    """
    Get nodes for 3D graph visualization with topics and relationships.
    """
    try:
        # Build query based on filters
        where_clause = "WHERE (m.is_deleted IS NULL OR m.is_deleted = false)"
        if scope:
            where_clause += f" AND m.scope = '{scope}'"
        
        query = f"""
        MATCH (m:Memory)
        {where_clause}
        RETURN m.id as id, m.content as content, m.tags as tags, 
               m.topics as topics, m.scope as scope, m.created_at as created_at
        LIMIT $limit
        """
        
        result = session.run(query, {"limit": limit})
        
        nodes = []
        for record in result:
            # Determine node group based on primary topic
            topics = record.get("topics", [])
            primary_topic = topics[0] if topics else "general"
            
            nodes.append({
                "id": record["id"],
                "label": record["content"][:50] + "..." if len(record["content"]) > 50 else record["content"],
                "content": record["content"],
                "tags": record.get("tags", []),
                "topics": topics,
                "scope": record.get("scope", "personal"),
                "group": primary_topic,  # For coloring in 3D graph
                "created_at": str(record.get("created_at", ""))
            })
        
        return {"nodes": nodes, "count": len(nodes)}
        
    except Exception as e:
        logger.error(f"Failed to fetch graph nodes: {e}")
        return {"nodes": [], "count": 0, "error": str(e)}

@app.get("/graph/relationships")
async def get_graph_relationships(session: Session = Depends(get_neo4j_session)):
    """
    Get relationships between nodes for graph visualization.
    """
    try:
        query = """
        MATCH (m1:Memory)-[r]->(m2:Memory)
        WHERE (m1.is_deleted IS NULL OR m1.is_deleted = false)
        AND (m2.is_deleted IS NULL OR m2.is_deleted = false)
        RETURN m1.id as source, m2.id as target, type(r) as type
        LIMIT 200
        """
        
        result = session.run(query)
        
        relationships = []
        for record in result:
            relationships.append({
                "source": record["source"],
                "target": record["target"],
                "type": record.get("type", "RELATED_TO")
            })
        
        return {"relationships": relationships, "count": len(relationships)}
        
    except Exception as e:
        logger.error(f"Failed to fetch relationships: {e}")
        return {"relationships": [], "count": 0, "error": str(e)}

@app.get("/graph/topics")
async def get_topic_distribution(session: Session = Depends(get_neo4j_session)):
    """
    Get topic distribution for filtering.
    """
    try:
        query = """
        MATCH (m:Memory)
        WHERE (m.is_deleted IS NULL OR m.is_deleted = false)
        UNWIND m.topics as topic
        RETURN topic, count(*) as count
        ORDER BY count DESC
        """
        
        result = session.run(query)
        
        topics = []
        for record in result:
            topics.append({
                "name": record["topic"],
                "count": record["count"]
            })
        
        return {"topics": topics}
        
    except Exception as e:
        logger.error(f"Failed to fetch topics: {e}")
        return {"topics": [], "error": str(e)}
