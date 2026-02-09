from sqlalchemy import Boolean, Column, String, DateTime, ARRAY
from sqlalchemy.dialects.postgresql import UUID
import uuid
from datetime import datetime
from .database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String, unique=True, index=True, nullable=False)
    full_name = Column(String)
    hashed_password = Column(String, nullable=True) # Nullable for SSO-only users
    provider = Column(String, default="local") # local, google, etc.
    is_active = Column(Boolean, default=True)
    is_superuser = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Simplified RBAC: List of scopes/roles
    # In a real enterprise app causing 'roles' table is better, but this suffices for now
    roles = Column(String, default="user") 
