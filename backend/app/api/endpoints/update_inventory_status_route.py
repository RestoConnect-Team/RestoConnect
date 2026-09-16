from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.update_inventory_status_controller import (
    update_inventory_status_controller,
)
from app.schemas import InventoryStatusUpdate, OneInventoryFromInventorys
from app.database.connection import get_db

router = APIRouter()


@router.patch(
    "/{inventory_id}/status",
    response_model=OneInventoryFromInventorys,
)
def update_inventory_status_endpoint(
    inventory_id: int,
    status_update: InventoryStatusUpdate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return update_inventory_status_controller(inventory_id, status_update, token, db)
