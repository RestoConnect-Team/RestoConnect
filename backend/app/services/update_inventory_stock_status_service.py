from sqlalchemy.orm import Session

from app.database.models import InventoryStock


def update_inventory_stock_status_service(
    inventory_stock_id: int, status, db: Session
) -> InventoryStock | None:
    inventory_stock = (
        db.query(InventoryStock)
        .filter(InventoryStock.id == inventory_stock_id)
        .one_or_none()
    )
    if not inventory_stock:
        return None

    inventory_stock.status = status
    db.commit()
    db.refresh(inventory_stock)
    return inventory_stock
