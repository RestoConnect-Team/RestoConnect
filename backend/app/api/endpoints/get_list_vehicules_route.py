from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import get_list_vehicules
from app.schemas import VehiculeListGrouped

from app.database.connection import get_db

router = APIRouter()

@router.get("/list_vehicules", response_model=VehiculeListGrouped)
def list_vehicules_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_vehicules(token, db)