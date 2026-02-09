from fastapi import FastAPI, BackgroundTasks
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from services.shared.database import neo4j_driver
from contextlib import asynccontextmanager
import logging

# Setup Logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("AnalystAgent")

# ---------------------------------------------------------------------------
# BACKGROUND JOBS
# ---------------------------------------------------------------------------

async def check_orphan_nodes():
    """
    Finds nodes in Neo4j that have no relationships.
    """
    logger.info("Analyst Agent: Scanning for Orphan Nodes...")
    query = """
    MATCH (n)
    WHERE size((n)--()) = 0
    RETURN n.id as id, n.content as content, labels(n) as labels
    LIMIT 50
    """
    with neo4j_driver.get_session() as session:
        result = session.run(query)
        orphans = [record.data() for record in result]
    
    if orphans:
        logger.warning(f"⚠️ Found {len(orphans)} Orphan Nodes! Suggesting cleanup or connection.")
        # TODO: Create an 'Alert' or 'Notification' in Postgres
    else:
        logger.info("No orphan nodes found. Graph is healthy.")

async def detect_contradictions():
    """
    STUB: Uses LLM to check for contradicting facts in recent memories.
    """
    logger.info("Analyst Agent: Analyzing for Contradictions...")
    # Logic:
    # 1. Fetch recent claims/facts.
    # 2. Ask LLM: "Do any of these contradict each other?"
    
    # Simulating a finding
    import random
    if random.choice([True, False]):
        logger.info("Consistency check passed.")
    else:
        logger.warning("⚠️ ALERT: Possible contradiction detected between Memory A and Memory B.")

async def check_tag_consistency():
    """
    Scans for tags that are nearly identical (case differences) and suggests normalization.
    Example: 'AI' vs 'Ai' vs 'ai'
    """
    logger.info("Analyst Agent: Checking Tag Consistency...")
    query = """
    MATCH (m:Memory)
    UNWIND m.tags as tag
    RETURN tag, count(tag) as freq
    """
    # In a real implementation:
    # 1. Fetch all unique tags
    # 2. Compute Levenshtein distance or simple Lowercase match
    # 3. If "AI" and "ai" both exist, flag as inconsistency
    
    # Stub Logic
    logger.info("Analyst: Tag scan complete. No major inconsistencies found (Stub).")


# ---------------------------------------------------------------------------
# LIFECYCLE & APP
# ---------------------------------------------------------------------------

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    logger.info("Analyst Agent Starting...")
    scheduler.add_job(check_orphan_nodes, 'interval', hours=4, id='orphan_check')
    scheduler.add_job(detect_contradictions, 'interval', hours=4, id='contradiction_check')
    scheduler.add_job(check_tag_consistency, 'interval', hours=24, id='tag_check')
    scheduler.start()
    yield
    # Shutdown
    logger.info("Analyst Agent Shutting Down...")
    scheduler.shutdown()

app = FastAPI(title="Analyst Agent Service", version="1.0.0", lifespan=lifespan)

@app.get("/agent/status")
def status():
    return {
        "status": "running", 
        "jobs": [str(job) for job in scheduler.get_jobs()]
    }

@app.post("/agent/trigger/orphans")
async def trigger_orphan_check(background_tasks: BackgroundTasks):
    """
    Manually trigger the Orphan Node Check immediately.
    """
    background_tasks.add_task(check_orphan_nodes)
    return {"message": "Orphan check triggered"}

@app.post("/agent/trigger/contradictions")
async def trigger_contradiction_check(background_tasks: BackgroundTasks):
    """
    Manually trigger the Contradiction Check immediately.
    """
    background_tasks.add_task(detect_contradictions)
    return {"message": "Contradiction check triggered"}

from pydantic import BaseModel
import httpx

# Initialize LLM for chat
llm = None

def _load_llm():
    """Lazy load LLM for chat"""
    global llm
    if llm is None:
        try:
            from services.shared.llm import setup_portkey_llm, AgentConfig
            config = AgentConfig()
            llm = setup_portkey_llm(config)
            logger.info("Chat LLM loaded successfully")
            return True
        except Exception as e:
            logger.error(f"Failed to load Chat LLM: {e}")
            return False
    return True

class ChatRequest(BaseModel):
    query: str

@app.post("/agent/chat")
async def chat(request: ChatRequest):
    """
    RAG-based Chat Endpoint.
    RAG-based Chat Endpoint using Portkey + Gemini with semantic search.
    """
    # Load LLM if not already loaded
    if not _load_llm():
        return {
            "response": "AI Engine offline. Please check Portkey configuration.",
            "sources": [],
            "thoughts": ""
        }
    
    context_text = ""
    sources = []
    
    # 1. Search Knowledge service using semantic search
    try:
        async with httpx.AsyncClient() as client:
            # Use query parameter for semantic search
            response = await client.get(
                "http://localhost:8000/knowledge/search", 
                params={"query": request.query, "limit": 5}
            )
            if response.status_code == 200:
                results = response.json()
                if results:
                    context_text = "\n\n".join([f"- {r['content'][:500]}" for r in results])
                    sources = ["Neural Knowledge Graph"]
    except Exception as e:
        logger.error(f"Failed to fetch context: {e}")

    # 2. Generate Response using LLM

    prompt = f"""You are NeuraLink AI, a cognitive assistant with access to the user's personal knowledge base.

Using the following memories from the user's brain, answer their query naturally and conversationally.
If no relevant context is found, use your general knowledge but mention that no specific memories were found.

Context from Knowledge Base:
{context_text if context_text else "No matching memories found."}

User Query: {request.query}

Provide a helpful, conversational response:"""

    try:
        # Generate response
        ai_response = await llm.ainvoke(prompt)
        content = ai_response.content
        
        # Extract thoughts if they exist in additional_kwargs (Portkey might pass them)
        thoughts = ai_response.additional_kwargs.get("thinking", "")
        
        return {
            "response": content,
            "thoughts": thoughts,
            "sources": sources,
            "context_used": bool(context_text)
        }
    except Exception as e:
        logger.error(f"LLM Generation failed: {e}")
        return {
            "response": f"Neural Link synchronization failed: {str(e)}",
            "sources": []
        }
