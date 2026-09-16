from sqlalchemy.orm import Session

from app.database.models import Inventory, InventoryStock
from app.enums import InventoryStatus, InventoryStockStatus


def restart_inventory_service(inventory_id: int, db: Session) -> Inventory | None:
    inventory = db.query(Inventory).filter(Inventory.id == inventory_id).one_or_none()
    if not inventory:
        return None

    inventory.status = InventoryStatus.ON_GOING
    inventory.inventory_end_date = None

    db.query(InventoryStock).filter(InventoryStock.inventory_id == inventory_id).update(
        {"status": InventoryStockStatus.NOT_FOUND, "scan_id": None},
        synchronize_session=False,
    )

    db.commit()
    db.refresh(inventory)
    return inventory
