from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, is_user_center_admin_service
from app.services.vehicule_inventory_service import (
    create_vehicule_inventory_service,
    get_vehicule_inventory_service,
    update_vehicule_inventory_item_service,
    validate_vehicule_inventory_service,
)
from app.schemas import (
    VehiculeInventoryResponse,
    OneVehiculeFromInventory,
    InventoryStockStatusUpdate,
)
from app.enums import InventoryStockStatus


def create_vehicule_inventory_controller(
    token: str | None, db: Session
) -> VehiculeInventoryResponse:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not is_user_center_admin_service(user):
        raise HTTPException(status_code=403, detail="User is not the center admin")

    return create_vehicule_inventory_service(user, db)


def get_vehicule_inventory_controller(
    inventory_id: int, token: str | None, db: Session
) -> VehiculeInventoryResponse:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    inventory = get_vehicule_inventory_service(inventory_id, db)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventaire véhicule non trouvé")
    return inventory


def update_vehicule_inventory_item_controller(
    item_id: int,
    payload: InventoryStockStatusUpdate,
    token: str | None,
    db: Session,
) -> OneVehiculeFromInventory:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not is_user_center_admin_service(user):
        raise HTTPException(status_code=403, detail="User is not the center admin")

    item = update_vehicule_inventory_item_service(item_id, payload.status, db)
    if not item:
        raise HTTPException(status_code=404, detail="Élément d'inventaire non trouvé")

    return OneVehiculeFromInventory(
        inventory_item_id=item.id,
        vehicule_id=item.vehicule_id,
        name=item.vehicule.name,
        immatriculation=item.vehicule.immatriculation,
        status_inventory_stock=item.status,
    )


def validate_vehicule_inventory_controller(
    inventory_id: int, token: str | None, db: Session
) -> VehiculeInventoryResponse:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not is_user_center_admin_service(user):
        raise HTTPException(status_code=403, detail="User is not the center admin")

    validate_vehicule_inventory_service(inventory_id, db)
    inventory = get_vehicule_inventory_service(inventory_id, db)
    if not inventory:
        raise HTTPException(status_code=404, detail="Inventaire véhicule non trouvé")
    return inventory
