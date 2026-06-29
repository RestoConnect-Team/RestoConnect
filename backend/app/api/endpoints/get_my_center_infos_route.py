from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_user_profile
from app.schemas import UserProfile

from app.database.connection import get_db

router = APIRouter()

@router.get("/my_center", response_model=UserProfile)
def profil_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_user_profile(token, db)