from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import delete_stock_controller

from app.database.connection import get_db


router = APIRouter()


@router.delete("/{stock_id}", response_model=bool)
def delete_stock_endpoint(
    stock_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return delete_stock_controller(stock_id, token, db)
