from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_center_stocks_controller
from app.schemas import OneEquipementFromList

from app.database.connection import get_db

router = APIRouter()

@router.get("/{center_id}/stocks", response_model=list[OneEquipementFromList])
def center_stocks_endpoint(center_id: int, token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_center_stocks_controller(center_id, token, db)