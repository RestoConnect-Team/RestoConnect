from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.transfer_stock_controller import transfer_stock_controller
from app.schemas import StockTransferRequest, OneEquipementFromList
from app.database.connection import get_db

router = APIRouter()


@router.post("/{stock_id}/transfer", response_model=OneEquipementFromList)
def transfer_stock_endpoint(
    stock_id: int,
    payload: StockTransferRequest,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return transfer_stock_controller(stock_id, payload, token, db)
