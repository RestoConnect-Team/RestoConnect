from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.update_vehicule_controller import update_vehicule_controller
from app.schemas import VehiculeUpdate, OneVehiculeFromList
from app.database.connection import get_db

router = APIRouter()


@router.put("/{vehicule_id}", response_model=OneVehiculeFromList)
def update_vehicule_endpoint(
    vehicule_id: int,
    payload: VehiculeUpdate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return update_vehicule_controller(vehicule_id, payload, token, db)
