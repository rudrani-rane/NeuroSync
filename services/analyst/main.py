from fastapi import FastAPI, Depends, HTTPException
from services.shared.database import get_neo4j_session
from neo4j import Session
import logging

app = FastAPI(title="Analyst Service", version="1.0.0")
logger = logging.getLogger(__name__)

@app.post("/analyst/cleanup")
async def cleanup_orphan_nodes(session: Session = Depends(get_neo4j_session)):
    """
    Clean up orphan nodes and disconnected memories.
    """
    try:
        # Find and delete orphan nodes (nodes with no relationships)
        query = """
        MATCH (m:Memory)
        WHERE NOT (m)--()
        AND (m.is_deleted IS NULL OR m.is_deleted = false)
        SET m.is_deleted = true, m.deleted_at = localdatetime()
        RETURN count(m) as deleted_count
        """
        
        result = session.run(query)
        record = result.single()
        deleted_count = record["deleted_count"] if record else 0
        
        return {
            "status": "success",
            "operation": "cleanup_orphan_nodes",
            "deleted_count": deleted_count,
            "message": f"Cleaned up {deleted_count} orphan nodes"
        }
    except Exception as e:
        logger.error(f"Cleanup failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyst/find_gaps")
async def find_logic_gaps(session: Session = Depends(get_neo4j_session)):
    """
    Find logic gaps and missing connections in knowledge graph.
    """
    try:
        # Find nodes with similar topics but no connections
        query = """
        MATCH (m1:Memory), (m2:Memory)
        WHERE m1.id < m2.id
        AND (m1.is_deleted IS NULL OR m1.is_deleted = false)
        AND (m2.is_deleted IS NULL OR m2.is_deleted = false)
        AND ANY(topic IN m1.topics WHERE topic IN m2.topics)
        AND NOT (m1)--(m2)
        RETURN m1.id as id1, m2.id as id2, m1.topics as topics1, m2.topics as topics2
        LIMIT 20
        """
        
        result = session.run(query)
        gaps = []
        for record in result:
            gaps.append({
                "node1": record["id1"],
                "node2": record["id2"],
                "shared_topics": list(set(record["topics1"]) & set(record["topics2"]))
            })
        
        return {
            "status": "success",
            "operation": "find_logic_gaps",
            "gaps_found": len(gaps),
            "gaps": gaps,
            "message": f"Found {len(gaps)} potential missing connections"
        }
    except Exception as e:
        logger.error(f"Gap analysis failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyst/generate_hypotheses")
async def generate_hypotheses(session: Session = Depends(get_neo4j_session)):
    """
    Generate hypotheses from knowledge graph patterns using LLM.
    """
    try:
        # Get topic distribution
        query = """
        MATCH (m:Memory)
        WHERE (m.is_deleted IS NULL OR m.is_deleted = false)
        UNWIND m.topics as topic
        RETURN topic, count(*) as count
        ORDER BY count DESC
        LIMIT 10
        """
        
        result = session.run(query)
        topic_dist = []
        for record in result:
            topic_dist.append({
                "topic": record["topic"],
                "count": record["count"]
            })
        
        # Use LLM to generate hypotheses
        from services.shared.llm import setup_fast_llm, AgentConfig
        config = AgentConfig()
        llm = setup_fast_llm(config)
        
        prompt = f"""Based on this knowledge graph topic distribution, generate 3 interesting hypotheses or insights about the user's thinking patterns:

Topic Distribution:
{chr(10).join([f"- {t['topic']}: {t['count']} memories" for t in topic_dist])}

Provide 3 numbered hypotheses:"""
        
        response = await llm.ainvoke(prompt)
        hypotheses_text = response.content
        
        # Parse hypotheses
        hypotheses = [h.strip() for h in hypotheses_text.split('\n') if h.strip() and any(c.isdigit() for c in h[:3])]
        
        return {
            "status": "success",
            "operation": "generate_hypotheses",
            "topic_distribution": topic_dist,
            "hypotheses": hypotheses[:3],
            "message": f"Generated {len(hypotheses[:3])} hypotheses from {len(topic_dist)} topics"
        }
    except Exception as e:
        logger.error(f"Hypothesis generation failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analyst/stats")
async def get_graph_stats(session: Session = Depends(get_neo4j_session)):
    """
    Get knowledge graph statistics.
    """
    try:
        # Total memories
        query1 = """
        MATCH (m:Memory)
        WHERE (m.is_deleted IS NULL OR m.is_deleted = false)
        RETURN count(m) as total
        """
        total = session.run(query1).single()["total"]
        
        # Memories by scope
        query2 = """
        MATCH (m:Memory)
        WHERE (m.is_deleted IS NULL OR m.is_deleted = false)
        RETURN m.scope as scope, count(*) as count
        """
        scopes = {}
        for record in session.run(query2):
            scopes[record["scope"]] = record["count"]
        
        # Total relationships
        query3 = """
        MATCH ()-[r]->()
        RETURN count(r) as total_relationships
        """
        relationships = session.run(query3).single()["total_relationships"]
        
        return {
            "total_memories": total,
            "memories_by_scope": scopes,
            "total_relationships": relationships,
            "graph_density": relationships / max(total, 1)
        }
    except Exception as e:
        logger.error(f"Stats retrieval failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
@app.post("/analyst/neural_mapping")
async def neural_mapping(session: Session = Depends(get_neo4j_session)):
    """
    Analyze knowledge graph and create semantic relationships between similar memories.
    """
    try:
        query = """
        MATCH (m1:Memory), (m2:Memory)
        WHERE m1.id < m2.id
        AND (m1.is_deleted IS NULL OR m1.is_deleted = false)
        AND (m2.is_deleted IS NULL OR m2.is_deleted = false)
        AND NOT (m1)-[:RELATED_TO]-(m2)
        WITH m1, m2, 
             size([t IN m1.topics WHERE t IN m2.topics]) as common_topics
        WHERE common_topics > 0
        MERGE (m1)-[r:RELATED_TO]->(m2)
        SET r.strength = common_topics * 0.2,
            r.created_at = localdatetime()
        RETURN count(r) as created_count
        """
        
        result = session.run(query)
        count = result.single()["created_count"]
        
        return {
            "status": "success",
            "operation": "neural_mapping",
            "created_count": count,
            "message": f"Successfully mapped {count} new semantic relationships"
        }
    except Exception as e:
        logger.error(f"Neural mapping failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/analyst/deep_search")
async def deep_search(request: dict, session: Session = Depends(get_neo4j_session)):
    """
    Perform deep graph traversal to find related memories starting from a query.
    """
    query_text = request.get("query", "")
    max_depth = request.get("depth", 2)
    
    try:
        # 1. First find seed nodes using semantic search via Knowledge service
        import httpx
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "http://localhost:8000/knowledge/search", 
                params={"query": query_text, "limit": 3}
            )
            if response.status_code != 200:
                raise Exception("Knowledge search failed")
            
            seeds = response.json()
            if not seeds:
                return {"status": "success", "results": [], "message": "No seed memories found for this query"}
            
            seed_ids = [s["id"] for s in seeds]
            
        # 2. Traverse graph from seed nodes
        traversal_query = """
        MATCH path = (start:Memory)-[*1..2]-(related:Memory)
        WHERE start.id IN $seed_ids
        AND (related.is_deleted IS NULL OR related.is_deleted = false)
        RETURN DISTINCT related.id as id, related.content as content, 
                        related.topics as topics, length(path) as depth
        ORDER BY depth ASC
        LIMIT 20
        """
        
        result = session.run(traversal_query, {"seed_ids": seed_ids})
        results = [record.data() for record in result]
        
        return {
            "status": "success",
            "operation": "deep_search",
            "query": query_text,
            "results": results,
            "message": f"Found {len(results)} related memories through deep graph traversal"
        }
    except Exception as e:
        logger.error(f"Deep search failed: {e}")
        raise HTTPException(status_code=500, detail=str(e))
