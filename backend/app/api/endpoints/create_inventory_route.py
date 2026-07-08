from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import create_inventory_controller
from app.schemas import OneStockFromInventory

from app.database.connection import get_db

router = APIRouter()

@router.get("/create_inventory", response_model=list[OneStockFromInventory])
def create_inventory_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return create_inventory_controller(token, db)
