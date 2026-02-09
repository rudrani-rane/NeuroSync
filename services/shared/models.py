from datetime import datetime
from typing import List, Optional, Dict, Any
from enum import Enum
from pydantic import BaseModel, Field
import uuid

# ---------------------------------------------------------------------------
# ENUMS
# ---------------------------------------------------------------------------

class BrainScope(str, Enum):
    PERSONAL = "personal"
    WORK_HR = "work_hr"
    WORK_FINANCE = "work_finance"
    WORK_LEGAL = "work_legal"
    WORK_ENGINEERING = "work_engineering"
    WORK_MARKETING = "work_marketing"
    WORK_SUPPLY_CHAIN = "work_supply_chain"
    SHARED_ALL = "shared_all"

class MemoryType(str, Enum):
    RAW = "raw"                 # Original text, transcript, etc.
    PROCESSED = "processed"     # Cleaned, structured
    SUMMARY = "summary"
    REFLECTION = "reflection"
    ENTITY = "entity"
    CONCEPT = "concept"
    EVENT = "event"
    DECISION = "decision"
    ACTION_ITEM = "action_item"

class IngestionSource(str, Enum):
    MANUAL_TEXT = "manual_text"
    FILE_UPLOAD = "file_upload"
    EMAIL = "email"
    SLACK = "slack"
    AUDIO_TRANSCRIPT = "audio_transcript"
    VISION_ANALYSIS = "vision_analysis"
    IMAGE_DESCRIPTION = "image_description"
    VIDEO_TRANSCRIPT = "video_transcript"
    WEB_CRAWL = "web_crawl"
    YOUTUBE = "youtube"

# ---------------------------------------------------------------------------
# SHARED MODELS
# ---------------------------------------------------------------------------

class UserBase(BaseModel):
    email: str
    full_name: str
    is_active: bool = True
    is_superuser: bool = False
    # Roles can be a list of scopes they have access to, or simple "admin/user"
    roles: List[str] = [] 

class UserCreate(UserBase):
    password: str

class UserInDB(UserBase):
    id: uuid.UUID = Field(default_factory=uuid.uuid4)
    hashed_password: str
    provider: Optional[str] = "local" # local, google, microsoft, etc.
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        from_attributes = True

class MemoryBlock(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    content: str
    source_type: IngestionSource
    source_id: Optional[str] = None # Link to original file ID or URL
    
    # Metadata
    user_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    timestamp: datetime = Field(default_factory=datetime.utcnow) # Actual time of event vs ingestion time
    
    # Intelligence
    memory_type: MemoryType = MemoryType.RAW
    confidence_score: float = 1.0
    embedding_id: Optional[str] = None
    
    # Categorization
    brain_scope: BrainScope = BrainScope.PERSONAL
    tags: List[str] = []
    
    # Vector DB metadata will be a flatted version of this
    
    class Config:
        from_attributes = True
