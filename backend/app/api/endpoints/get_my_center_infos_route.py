from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_my_center_infos_controller
from app.schemas import CenterInfos

from app.database.connection import get_db

router = APIRouter()

@router.get("/my_center", response_model=CenterInfos)
def profil_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_my_center_infos_controller(token, db)