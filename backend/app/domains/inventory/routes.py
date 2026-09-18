from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.domains.inventory.controller import (
    create_inventory_controller,
    get_list_inventories_controller,
    get_list_stocks_inventory_controller,
)
from app.domains.inventory.schemas import OneStockFromInventory, OneInventoryFromInventorys

router = APIRouter()

@router.get("/create_inventory", response_model=list[OneStockFromInventory])
def create_inventory_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return create_inventory_controller(token, db)


@router.get("/list_inventories", response_model=list[OneInventoryFromInventorys])
def list_inventories_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_inventories_controller(token, db)


@router.get("/list_stocks_inventory/{inventory_id}", response_model=list[OneStockFromInventory])
def get_list_stocks_inventory_endpoint(inventory_id: int, db: Session = Depends(get_db)):
    return get_list_stocks_inventory_controller(inventory_id, db)