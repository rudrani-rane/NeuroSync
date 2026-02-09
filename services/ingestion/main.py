from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from typing import List, Optional
from services.shared.models import BrainScope, IngestionSource, MemoryBlock, MemoryType
import shutil
import os
import uuid
import httpx
import logging

# Setup logging
logger = logging.getLogger(__name__)

KNOWLEDGE_SERVICE_URL = "http://127.0.0.1:8000/knowledge/add"

# Import processor for file processing
from services.ingestion.processor import processor

app = FastAPI(title="Ingestion Service", version="1.0.0")

UPLOAD_DIR = "./uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@app.post("/ingest/file")
async def ingest_file(
    file: UploadFile = File(...),
    brain_scope: BrainScope = Form(...),
    tags: Optional[str] = Form(""),
    ocr: Optional[bool] = Form(True),
    scene: Optional[bool] = Form(True),
    objects: Optional[bool] = Form(True)
):
    """
    Ingest files (images, PDFs, audio, etc.).
    For images, performs vision analysis based on selected parameters.
    """
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    
    # Save file temporarily
    file_path = f"./uploads/{file.filename}"
    os.makedirs("./uploads", exist_ok=True)
    
    with open(file_path, "wb") as f:
        f.write(await file.read())
    
    # Determine source type and process
    mime_type = file.content_type or "application/octet-stream"
    
    # For images, use vision analysis with user-selected parameters
    if mime_type.startswith("image/"):
        extracted_content = await processor.analyze_image(file_path, ocr=ocr, scene=scene, objects=objects)
        source = IngestionSource.VISION_ANALYSIS.value
    else:
        extracted_content = await processor.process_file(file_path, mime_type)
        source = IngestionSource.FILE_UPLOAD.value

    logger.info(f"[INGESTION] Extracted content length: {len(extracted_content)}")

    payload = {
        "content": extracted_content,
        "brain_scope": brain_scope.value,
        "source_type": source,
        "tags": tag_list
    }

    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(KNOWLEDGE_SERVICE_URL, json=payload, timeout=15.0)
            response.raise_for_status()
            result = response.json()
            
            # Return extracted content for UI display
            return {
                **result, 
                "extracted": extracted_content,
                "preview": extracted_content[:500] + ("..." if len(extracted_content) > 500 else "")
            }
        except Exception as e:
            logger.error(f"ERROR: File Ingestion failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Knowledge Service unreachable: {str(e)}")

@app.post("/ingest/text")
async def ingest_text(
    content: str = Form(...),
    brain_scope: BrainScope = Form(...),
    tags: Optional[str] = Form("")
):
    """
    Ingest raw text.
    """
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    
    payload = {
        "content": content,
        "brain_scope": brain_scope.value,
        "source_type": IngestionSource.MANUAL_TEXT.value,
        "tags": tag_list
    }
    
    logger.info(f"DEBUG: Ingesting text to {KNOWLEDGE_SERVICE_URL}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(KNOWLEDGE_SERVICE_URL, json=payload, timeout=10.0)
            response.raise_for_status()
            result = response.json()
            return {
                **result,
                "preview": content[:500] + ("..." if len(content) > 500 else "")
            }
        except Exception as e:
            logger.error(f"ERROR: Ingestion failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Knowledge Service unreachable: {str(e)}")

@app.post("/ingest/audio")
async def ingest_audio(
    file: UploadFile = File(...),
    brain_scope: BrainScope = Form(...),
    tags: Optional[str] = Form(""),
    transcribe: Optional[bool] = Form(True)
):
    """
    Ingest audio, optionally transcribe, and store.
    """
    # 1. Save File
    file_id = str(uuid.uuid4())
    file_path = f"{UPLOAD_DIR}/{file_id}_{file.filename}"
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    
    # 2. Transcribe if requested
    from services.ingestion.processor import processor
    
    if transcribe:
        transcript = await processor.transcribe_audio(file_path)
        content = transcript
    else:
        content = f"[Audio File]: {file.filename} (Not transcribed)"
    
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    if "audio" not in tag_list:
        tag_list.append("audio")

    payload = {
        "content": content,
        "brain_scope": brain_scope.value,
        "source_type": IngestionSource.AUDIO_TRANSCRIPT.value,
        "tags": tag_list
    }
    
    print(f"DEBUG: Ingesting audio {'transcript' if transcribe else 'file'} to {KNOWLEDGE_SERVICE_URL}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(KNOWLEDGE_SERVICE_URL, json=payload, timeout=15.0)
            response.raise_for_status()
            result = response.json()
            return {
                **result, 
                "transcript": content, 
                "transcribed": transcribe,
                "preview": content[:500] + ("..." if len(content) > 500 else "")
            }
        except Exception as e:
            logger.error(f"ERROR: Audio ingestion failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Knowledge Service unreachable: {str(e)}")

@app.post("/ingest/url")
async def ingest_url(
    url: str = Form(...),
    brain_scope: BrainScope = Form(...),
    tags: Optional[str] = Form(""),
    translate: Optional[bool] = Form(False)
):
    """
    Ingest content from a URL.
    Supports YouTube video transcription and web scraping.
    """
    # 1. Scraping/Transcription
    from services.ingestion.processor import processor
    scraped_content = await processor.scrape_url(url, translate=translate)
    
    tag_list = [t.strip() for t in tags.split(",") if t.strip()]
    if "url" not in tag_list:
        tag_list.append("web")

    # Determine source type based on URL
    if 'youtube.com' in url or 'youtu.be' in url:
        source_type = IngestionSource.AUDIO_TRANSCRIPT.value  # YouTube transcripts
        tag_list.append("youtube")
    else:
        source_type = IngestionSource.WEB_CRAWL.value

    payload = {
        "content": scraped_content,
        "brain_scope": brain_scope.value,
        "source_type": source_type,
        "tags": tag_list,
        "source_url": url  # Include source URL for System Logs
    }
    
    print(f"DEBUG: Ingesting URL content from {url} to {KNOWLEDGE_SERVICE_URL}")
    
    async with httpx.AsyncClient() as client:
        try:
            response = await client.post(KNOWLEDGE_SERVICE_URL, json=payload, timeout=15.0)
            response.raise_for_status()
            result = response.json()
            return {
                **result,
                "scraped": scraped_content,
                "preview": scraped_content[:500] + ("..." if len(scraped_content) > 500 else "")
            }
        except Exception as e:
            logger.error(f"ERROR: URL Ingestion failed: {str(e)}")
            raise HTTPException(status_code=500, detail=f"Knowledge Service unreachable: {str(e)}")
