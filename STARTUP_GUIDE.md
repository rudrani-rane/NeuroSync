# NeuraLink Startup Guide

## Prerequisites
- Docker Desktop running with Neo4j container
- Python virtual environment activated
- All packages installed

## Step-by-Step Startup

### 1. Start Docker Containers (if not running)

```powershell
cd c:\Users\s1371670\secondbrain\infrastructure
docker-compose up -d
```

**Verify containers are running:**
```powershell
docker ps
```

You should see:
- `brain_neo4j` (port 7474, 7687)
- `brain_postgres` (port 5432)
- `brain_redis` (port 6379)
- `brain_chroma` (port 8002)

### 2. Start Backend (Python/FastAPI)

Open a **new terminal** in VS Code:

```powershell
cd c:\Users\s1371670\secondbrain
.\venv\Scripts\activate
python -m uvicorn services.gateway.main:app --port 8000 --reload
```

**Expected output:**
```
INFO:     Uvicorn running on http://127.0.0.1:8000
INFO:     Application startup complete.
```

**Test backend:**
```powershell
curl http://127.0.0.1:8000/
```

Should return: `{"message":"Welcome to the Second Brain Enterprise API"}`

### 3. Start Frontend (Next.js)

Open **another new terminal** in VS Code:

```powershell
cd c:\Users\s1371670\secondbrain\apps\web
npm run dev
```

**Expected output:**
```
ready - started server on 0.0.0.0:3000
```

### 4. Access Application

Open browser: **http://localhost:3000**

---

## Troubleshooting

### Backend Issues

**Problem**: Import errors or module not found
```powershell
# Reinstall packages
.\venv\Scripts\pip install -r requirements.txt
.\venv\Scripts\pip install sentence-transformers spacy yt-dlp pytesseract
.\venv\Scripts\python -m spacy download en_core_web_sm
```

**Problem**: Neo4j connection failed
```powershell
# Check Neo4j is running
docker ps | findstr neo4j

# Restart Neo4j
docker restart brain_neo4j

# Test connection
python verify_neo4j.py
```

**Problem**: Port 8000 already in use
```powershell
# Find and kill process
netstat -ano | findstr :8000
taskkill /PID <PID> /F
```

### Frontend Issues

**Problem**: Module not found
```powershell
cd apps\web
npm install
```

**Problem**: Port 3000 already in use
```powershell
# Kill process on port 3000
netstat -ano | findstr :3000
taskkill /PID <PID> /F
```

---

## Quick Test Commands

### Test Text Ingestion
```powershell
curl -X POST "http://127.0.0.1:8000/ingestion/ingest/text" ^
  -H "Content-Type: application/x-www-form-urlencoded" ^
  -d "content=This+is+a+test+memory&brain_scope=personal"
```

### Test Chat
```powershell
curl -X POST "http://127.0.0.1:8000/agent/chat" ^
  -H "Content-Type: application/json" ^
  -d "{\"query\":\"What do you know about me?\"}"
```

### Test Analyst Stats
```powershell
curl http://127.0.0.1:8000/analyst/stats
```

---

## Current Status

✅ **Backend**: Running on port 8000
- All services mounted (ingestion, knowledge, agent, analyst, graph)
- Neo4j connected
- Portkey LLM configured

⏳ **Frontend**: Needs to be started
- Run `npm run dev` in `apps/web` directory
- Access at http://localhost:3000

---

## Common Workflow

1. **Start Docker** → `docker-compose up -d`
2. **Start Backend** → `python -m uvicorn services.gateway.main:app --port 8000 --reload`
3. **Start Frontend** → `cd apps/web && npm run dev`
4. **Open Browser** → http://localhost:3000
5. **Test Features** → Use the UI tabs

---

## Environment Variables

Make sure `.env` file exists in root with:
```
PORTKEY_API_KEY=your_key_here
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password
```
