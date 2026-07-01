from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import get_center_infos_controller
from app.schemas import CenterInfos

from app.database.connection import get_db

router = APIRouter()

@router.get("/center/{center_id}", response_model=CenterInfos)
def center_infos_endpoint(center_id: int, db: Session = Depends(get_db)):
    return get_center_infos_controller(center_id, db)