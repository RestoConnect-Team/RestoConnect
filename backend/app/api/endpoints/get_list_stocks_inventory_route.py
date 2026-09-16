from fastapi import APIRouter, Depends, Cookie, HTTPException
from sqlalchemy.orm import Session

from app.controllers.get_list_stocks_inventory_controller import (
    get_list_stocks_inventory_controller,
)
from app.schemas import OneStockFromInventory
from app.services.get_user_service import get_user_by_token_service

from app.database.connection import get_db

router = APIRouter()


@router.get(
    "/list_stocks_inventory/{inventory_id}", response_model=list[OneStockFromInventory]
)
def get_list_stocks_inventory_endpoint(
    inventory_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    if not get_user_by_token_service(db, token):
        raise HTTPException(status_code=401, detail="Invalid token")
    return get_list_stocks_inventory_controller(inventory_id, db)
