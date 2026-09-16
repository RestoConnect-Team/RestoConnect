from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.vehicule_inventory_controller import (
    create_vehicule_inventory_controller,
    get_vehicule_inventory_controller,
    update_vehicule_inventory_item_controller,
    validate_vehicule_inventory_controller,
)
from app.schemas import (
    VehiculeInventoryResponse,
    OneVehiculeFromInventory,
    InventoryStockStatusUpdate,
)
from app.database.connection import get_db

router = APIRouter()


@router.post("/create_inventory", response_model=VehiculeInventoryResponse)
def create_vehicule_inventory_endpoint(
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return create_vehicule_inventory_controller(token, db)


@router.get("/{inventory_id}", response_model=VehiculeInventoryResponse)
def get_vehicule_inventory_endpoint(
    inventory_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return get_vehicule_inventory_controller(inventory_id, token, db)


@router.patch("/item/{item_id}/status", response_model=OneVehiculeFromInventory)
def update_vehicule_inventory_item_endpoint(
    item_id: int,
    payload: InventoryStockStatusUpdate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return update_vehicule_inventory_item_controller(item_id, payload, token, db)


@router.patch("/{inventory_id}/validate", response_model=VehiculeInventoryResponse)
def validate_vehicule_inventory_endpoint(
    inventory_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return validate_vehicule_inventory_controller(inventory_id, token, db)
