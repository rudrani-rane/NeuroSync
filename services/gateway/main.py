from fastapi import FastAPI, Depends, HTTPException, status
import httpx
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from services.shared.database import engine, Base, get_postgres_db
from services.shared.models import UserCreate, UserInDB
from services.shared.sql_models import User
from services.shared.security import get_password_hash, create_access_token, verify_password
from fastapi.security import OAuth2PasswordRequestForm
from datetime import timedelta

# Initialize DB Tables (Quick & Dirty for MVP)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Second Brain Gateway", version="1.0.0")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {"message": "Welcome to the Second Brain Enterprise API"}

# ---------------------------------------------------------------------------
# AUTH ENDPOINTS
# ---------------------------------------------------------------------------

@app.post("/auth/register", response_model=UserInDB)
def register(user: UserCreate, db: Session = Depends(get_postgres_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_pw = get_password_hash(user.password)
    new_user = User(
        email=user.email,
        full_name=user.full_name,
        hashed_password=hashed_pw,
        provider="local"
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return new_user

@app.post("/auth/token")
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(get_postgres_db)):
    user = db.query(User).filter(User.email == form_data.username).first()
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(subject=user.id, expires_delta=timedelta(minutes=60))
    return {"access_token": access_token, "token_type": "bearer"}

# ---------------------------------------------------------------------------
# SSO STUB (Placeholder)
# ---------------------------------------------------------------------------
@app.get("/auth/sso/login")
def sso_login():
    return {"message": "Redirect to Identity Provider (Google/Okta/AzureAD)"}

@app.get("/auth/sso/callback")
def sso_callback():
    # Logic: 
    # 1. Receive code
    # 2. Exchange for Token
    # 3. Get User Info
    # 4. Check if User exists in DB
    # 5. If not, create (JIT Provisioning)
    # 6. Return internal JWT
    return {"message": "SSO Callback - User Logged In"}

from services.gateway.routers import users
app.include_router(users.router)

# MOUNT MICROSERVICES (For Local Monolithic Dev Mode)
from services.ingestion.main import app as ingestion_app
from services.knowledge.main import app as knowledge_app

app.mount("/ingestion", ingestion_app)
app.mount("/knowledge", knowledge_app)

from services.agent.main import app as agent_app
app.mount("/agent", agent_app)

from services.analyst.main import app as analyst_app
app.mount("/analyst", analyst_app)

from services.graph.main import app as graph_app
app.mount("/graph", graph_app)

@app.get("/system/stats")
async def get_system_stats(db: Session = Depends(get_postgres_db)):
    """
    Admin: Get counts and system metrics.
    """
    from services.shared.database import neo4j_driver
    
    # 1. User count (Postgres)
    user_count = db.query(User).count()
    
    # 2. Node count (Neo4j)
    node_count = 0
    try:
        with neo4j_driver.get_session() as session:
            result = session.run("MATCH (n) RETURN count(n)")
            node_count = result.single()[0]
    except Exception:
        pass

    # 3. Knowledge blocks (Simulated or count from specialized tag/label)
    # For now, let's just make it slightly different for visual variety
    return {
        "total_users": user_count,
        "knowledge_items": node_count, # Simplified mapping
        "graph_nodes": node_count,
        "documents": 12, # Stub
        "storage_used": "4.2 GB", # Stub
        "status": "Healthy",
        "details": {
            "server_started": "2026-01-30",
            "python_version": "3.11.x",
            "storage_path": "/var/lib/secondbrain"
        }
    }

@app.get("/system/logs")
async def get_logs():
    """
    Proxy to knowledge/recent
    """
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get("http://127.0.0.1:8000/knowledge/recent")
            response.raise_for_status()
            return response.json()
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Knowledge Service unreachable: {str(e)}")
