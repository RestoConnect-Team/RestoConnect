from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.create_vehicule_controller import create_vehicule_controller
from app.schemas import VehiculeCreate, OneVehiculeFromList
from app.database.connection import get_db

router = APIRouter()


@router.post("", response_model=OneVehiculeFromList)
def create_vehicule_endpoint(
    payload: VehiculeCreate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return create_vehicule_controller(payload, token, db)
