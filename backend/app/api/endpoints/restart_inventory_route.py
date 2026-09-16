from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.restart_inventory_controller import (
    restart_inventory_controller,
)
from app.schemas import OneInventoryFromInventorys
from app.database.connection import get_db

router = APIRouter()


@router.post("/{inventory_id}/restart", response_model=OneInventoryFromInventorys)
def restart_inventory_endpoint(
    inventory_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return restart_inventory_controller(inventory_id, token, db)
