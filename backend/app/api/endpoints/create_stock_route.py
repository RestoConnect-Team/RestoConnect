from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.create_stock_controller import create_stock_controller
from app.schemas import StockCreate, OneEquipementFromList
from app.database.connection import get_db

router = APIRouter()


@router.post("", response_model=OneEquipementFromList)
def create_stock_endpoint(
    payload: StockCreate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return create_stock_controller(payload, token, db)
