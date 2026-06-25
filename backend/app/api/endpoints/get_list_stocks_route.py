from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_list_stocks_controller
from app.schemas import OneEquipementFromList

from app.database.connection import get_db

router = APIRouter()

@router.get("/stock_list", response_model=list[OneEquipementFromList])
def list_stocks_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_stocks_controller(token, db)