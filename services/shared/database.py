import os
from neo4j import GraphDatabase
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.ext.declarative import declarative_base

# ---------------------------------------------------------------------------
# CONFIGURATION
# ---------------------------------------------------------------------------
NEO4J_URI = os.getenv("NEO4J_URI", "bolt://localhost:7687")
NEO4J_USER = os.getenv("NEO4J_USER", "neo4j")
NEO4J_PASSWORD = os.getenv("NEO4J_PASSWORD", "password")

POSTGRES_USER = os.getenv("POSTGRES_USER", "postgres")
POSTGRES_PASSWORD = os.getenv("POSTGRES_PASSWORD", "password")
POSTGRES_DB = os.getenv("POSTGRES_DB", "secondbrain")
POSTGRES_HOST = os.getenv("POSTGRES_HOST", "localhost")
POSTGRES_PORT = os.getenv("POSTGRES_PORT", "5432")

POSTGRES_URL = f"postgresql://{POSTGRES_USER}:{POSTGRES_PASSWORD}@{POSTGRES_HOST}:{POSTGRES_PORT}/{POSTGRES_DB}"

# ---------------------------------------------------------------------------
# NEO4J (GRAPH)
# ---------------------------------------------------------------------------
import logging
logger = logging.getLogger(__name__)

class Neo4jDriver:
    def __init__(self):
        try:
            self._driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))
            # Verify connection
            with self._driver.session() as session:
                result = session.run("RETURN 1 as test")
                test_value = result.single()[0]
                logger.info(f"✅ Neo4j connected successfully at {NEO4J_URI}")
        except Exception as e:
            logger.error(f"❌ Neo4j connection failed: {e}")
            raise

    def close(self):
        if self._driver:
            self._driver.close()

    def get_session(self):
        """Get a new session - caller is responsible for closing it"""
        return self._driver.session()

neo4j_driver = None

def get_neo4j_session():
    """Dependency injection for FastAPI - yields a session and ensures it's closed"""
    global neo4j_driver
    if not neo4j_driver:
        neo4j_driver = Neo4jDriver()
    
    session = neo4j_driver.get_session()
    try:
        yield session
    finally:
        session.close()

# ---------------------------------------------------------------------------
# POSTGRES (RELATIONAL)
# ---------------------------------------------------------------------------
engine = create_engine(POSTGRES_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

def get_postgres_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
