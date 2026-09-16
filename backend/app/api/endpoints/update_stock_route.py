from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.update_stock_controller import update_stock_controller
from app.schemas import StockUpdate, OneEquipementFromList
from app.database.connection import get_db

router = APIRouter()


@router.put("/{stock_id}", response_model=OneEquipementFromList)
def update_stock_endpoint(
    stock_id: int,
    payload: StockUpdate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return update_stock_controller(stock_id, payload, token, db)
