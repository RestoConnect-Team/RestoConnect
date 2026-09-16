from sqlalchemy.orm import Session

from app.database.models import Inventory, InventoryStock, Stock
from app.enums import InventoryStatus, InventoryStockStatus


def mark_stock_found_in_inventory_service(
    stock_id: int, center_id: int, db: Session
) -> bool:
    """Marque le stock "Présent" dans l'inventaire en cours.

    Retourne True si le stock était déjà "Présent" (doublon de scan).
    """
    ongoing_inventory = (
        db.query(Inventory)
        .filter(
            Inventory.center_id == center_id,
            Inventory.status == InventoryStatus.ON_GOING,
        )
        .order_by(Inventory.id.desc())
        .first()
    )
    if not ongoing_inventory:
        return False

    inventory_stock = (
        db.query(InventoryStock)
        .filter(
            InventoryStock.inventory_id == ongoing_inventory.id,
            InventoryStock.stock_id == stock_id,
        )
        .first()
    )
    if not inventory_stock:
        return False

    if inventory_stock.status != InventoryStockStatus.FOUND:
        inventory_stock.status = InventoryStockStatus.FOUND
        db.commit()
        return False

    return True
