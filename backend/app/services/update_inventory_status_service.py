from datetime import date

from sqlalchemy.orm import Session

from app.database.models import Inventory
from app.enums import InventoryStatus


def update_inventory_status_service(
    inventory_id: int, status: InventoryStatus, db: Session
) -> Inventory | None:
    inventory = db.query(Inventory).filter(Inventory.id == inventory_id).one_or_none()
    if not inventory:
        return None

    inventory.status = status
    if status == InventoryStatus.FINISHED:
        inventory.inventory_end_date = date.today()

    db.commit()
    db.refresh(inventory)
    return inventory
