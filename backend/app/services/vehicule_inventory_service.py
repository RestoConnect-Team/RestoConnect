from datetime import date

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import (
    User,
    Vehicule,
    VehiculeInventory,
    VehiculeInventoryItem,
)
from app.enums import InventoryStatus, InventoryStockStatus
from app.schemas import (
    VehiculeInventoryResponse,
    OneVehiculeFromInventory,
)


def create_vehicule_inventory_service(
    user: User, db: Session
) -> VehiculeInventoryResponse:
    inventory = VehiculeInventory(
        inventory_start_date=date.today(),
        status=InventoryStatus.ON_GOING,
        center_id=user.center_id,
        user_id=user.id,
    )
    db.add(inventory)
    db.commit()
    db.refresh(inventory)

    vehicules = db.query(Vehicule).filter(Vehicule.center_id == user.center_id).all()

    items = []
    for vehicule in vehicules:
        item = VehiculeInventoryItem(
            status=InventoryStockStatus.NOT_FOUND,
            vehicule_id=vehicule.id,
            inventory_id=inventory.id,
        )
        db.add(item)
        items.append((item, vehicule))
    db.commit()

    return _to_response(inventory, items, db)


def get_vehicule_inventory_service(
    inventory_id: int, db: Session
) -> VehiculeInventoryResponse | None:
    inventory = (
        db.query(VehiculeInventory)
        .filter(VehiculeInventory.id == inventory_id)
        .one_or_none()
    )
    if not inventory:
        return None

    items = (
        db.query(VehiculeInventoryItem)
        .filter(VehiculeInventoryItem.inventory_id == inventory_id)
        .all()
    )

    pairs = [(item, item.vehicule) for item in items]
    return _to_response(inventory, pairs, db)


def _to_response(inventory, pairs, db: Session) -> VehiculeInventoryResponse:
    item_schemas = [
        OneVehiculeFromInventory(
            inventory_item_id=item.id,
            vehicule_id=vehicule.id,
            name=vehicule.name,
            immatriculation=vehicule.immatriculation,
            status_inventory_stock=item.status,
        )
        for item, vehicule in pairs
    ]
    return VehiculeInventoryResponse(
        inventory_id=inventory.id,
        start_date=inventory.inventory_start_date,
        end_date=inventory.inventory_end_date,
        status=inventory.status,
        items=item_schemas,
    )


def update_vehicule_inventory_item_service(
    item_id: int, status: InventoryStockStatus, db: Session
) -> VehiculeInventoryItem | None:
    item = (
        db.query(VehiculeInventoryItem)
        .filter(VehiculeInventoryItem.id == item_id)
        .one_or_none()
    )
    if not item:
        return None
    item.status = status
    db.commit()
    db.refresh(item)
    return item


def validate_vehicule_inventory_service(
    inventory_id: int, db: Session
) -> VehiculeInventory | None:
    inventory = (
        db.query(VehiculeInventory)
        .filter(VehiculeInventory.id == inventory_id)
        .one_or_none()
    )
    if not inventory:
        return None
    inventory.status = InventoryStatus.FINISHED
    inventory.inventory_end_date = date.today()
    db.commit()
    db.refresh(inventory)
    return inventory
