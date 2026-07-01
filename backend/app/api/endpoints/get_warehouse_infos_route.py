from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import get_warehouse_infos_controller
from app.schemas import WarehouseInfos

from app.database.connection import get_db

router = APIRouter()

@router.get("/warehouse/{warehouse_id}", response_model=WarehouseInfos)
def center_infos_endpoint(warehouse_id: int, db: Session = Depends(get_db)):
    return get_warehouse_infos_controller(warehouse_id, db)