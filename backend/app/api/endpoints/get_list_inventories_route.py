from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_list_inventories_controller
from app.schemas import OneInventoryFromInventorys

from app.database.connection import get_db

router = APIRouter()

@router.get("/list_inventories", response_model=list[OneInventoryFromInventorys])
def list_inventories_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_inventories_controller(token, db)