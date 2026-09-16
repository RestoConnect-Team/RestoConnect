from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.create_user_controller import create_user_controller
from app.schemas import UserCreate, UserProfile
from app.database.connection import get_db

router = APIRouter()


@router.post("", response_model=UserProfile)
def create_user_endpoint(
    payload: UserCreate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return create_user_controller(payload, token, db)
