from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service
from app.services.update_inventory_stock_status_service import (
    update_inventory_stock_status_service,
)
from app.schemas import InventoryStockStatusUpdate, OneStockFromInventory
from app.database.models import InventoryStock


def update_inventory_stock_status_controller(
    inventory_stock_id: int,
    status_update: InventoryStockStatusUpdate,
    token: str | None,
    db: Session,
) -> OneStockFromInventory:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    inventory_stock = (
        db.query(InventoryStock)
        .filter(InventoryStock.id == inventory_stock_id)
        .one_or_none()
    )
    if not inventory_stock:
        raise HTTPException(status_code=404, detail="Inventory stock not found")

    if inventory_stock.inventory.center_id != user.center_id:
        raise HTTPException(status_code=403, detail="Accès refusé à cet inventaire")

    updated = update_inventory_stock_status_service(
        inventory_stock_id, status_update.status, db
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Inventory stock not found")

    return OneStockFromInventory(
        inventory_stock_id=updated.id,
        reference=updated.stock.reference,
        name=updated.stock.name,
        category=updated.stock.category,
        qr_code=updated.stock.qr_code,
        status_inventory_stock=updated.status,
    )
