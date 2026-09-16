from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.update_inventory_stock_status_controller import (
    update_inventory_stock_status_controller,
)
from app.schemas import InventoryStockStatusUpdate, OneStockFromInventory
from app.database.connection import get_db

router = APIRouter()


@router.patch(
    "/inventory_stock/{inventory_stock_id}/status",
    response_model=OneStockFromInventory,
)
def update_inventory_stock_status_endpoint(
    inventory_stock_id: int,
    status_update: InventoryStockStatusUpdate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return update_inventory_stock_status_controller(
        inventory_stock_id, status_update, token, db
    )
