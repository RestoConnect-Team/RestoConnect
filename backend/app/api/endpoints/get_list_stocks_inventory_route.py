from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import get_list_stocks_inventory_controller
from app.schemas import OneStockFromInventory

from app.database.connection import get_db

router = APIRouter()

@router.get("/list_stocks_inventory/{inventory_id}", response_model=list[OneStockFromInventory])
def get_list_stocks_inventory_endpoint(inventory_id: int, db: Session = Depends(get_db)):
    return get_list_stocks_inventory_controller(inventory_id, db)
