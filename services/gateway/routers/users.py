from fastapi import APIRouter, Depends, HTTPException
from typing import List
from sqlalchemy.orm import Session
from services.shared.database import get_postgres_db
from services.shared.sql_models import User
from services.shared.models import UserInDB, UserCreate
from services.shared.security import get_password_hash
from services.gateway.deps import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["users"],
    responses={404: {"description": "Not found"}},
)

@router.get("/", response_model=List[UserInDB])
def read_users(skip: int = 0, limit: int = 100, current_user: User = Depends(get_current_user), db: Session = Depends(get_postgres_db)):
    """
    Admin: List all users.
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    users = db.query(User).offset(skip).limit(limit).all()
    return users

@router.get("/me", response_model=UserInDB)
def read_user_me(current_user: User = Depends(get_current_user)):
    """
    Get current logged in user profile.
    """
    return current_user

@router.get("/{user_id}", response_model=UserInDB)
def read_user(user_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_postgres_db)):
    """
    Admin: Get specific user.
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.delete("/{user_id}")
def delete_user(user_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_postgres_db)):
    """
    Admin: Delete a user.
    """
    if not current_user.is_superuser:
        raise HTTPException(status_code=403, detail="Not enough permissions")
    
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    db.delete(user)
    db.commit()
    return {"ok": True}
