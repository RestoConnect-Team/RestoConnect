from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_center_infos_controller, update_center_controller
from app.schemas import CenterInfos, UpdateCenterRequest

from app.database.connection import get_db

router = APIRouter()

@router.get("/center/{center_id}", response_model=CenterInfos)
def center_infos_endpoint(center_id: int, token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_center_infos_controller(center_id, db, token)

@router.put("/center/{center_id}")
def update_center_endpoint(center_id: int, payload: UpdateCenterRequest, db: Session = Depends(get_db)):
    return update_center_controller(center_id, payload, db)