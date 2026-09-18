from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.domains.center.controller import (
    get_list_centers_controller,
    get_my_center_infos_controller,
    get_center_infos_controller,
    get_warehouse_infos_controller,
    update_center_controller,
    delete_center_controller,
)
from app.domains.center.schemas import CenterInfos, ListCentersResponse, UpdateCenterRequest, WarehouseInfos

# Routeur sans préfixe : /list_centers et /my_center
router = APIRouter()


@router.get("/list_centers", response_model=ListCentersResponse)
def list_centers_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_centers_controller(token, db)


@router.get("/my_center", response_model=CenterInfos)
def my_center_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_my_center_infos_controller(token, db)


# Routeur préfixé /center : tout ce qui utilise /{center_id}
center_router = APIRouter()


@center_router.delete("/{center_id}", response_model=bool)
def delete_center_endpoint(
    center_id: int,
    db: Session = Depends(get_db)
):
    return delete_center_controller(center_id, db)


@center_router.get("/{center_id}", response_model=CenterInfos)
def center_infos_endpoint(center_id: int, token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_center_infos_controller(center_id, db, token)


@center_router.put("/{center_id}")
def update_center_endpoint(center_id: int, payload: UpdateCenterRequest, db: Session = Depends(get_db)):
    return update_center_controller(center_id, payload, db)


# Routeur préfixé /warehouse
warehouse_router = APIRouter()


@warehouse_router.get("/{warehouse_id}", response_model=WarehouseInfos)
def warehouse_infos_endpoint(warehouse_id: int, db: Session = Depends(get_db)):
    return get_warehouse_infos_controller(warehouse_id, db)