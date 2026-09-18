from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.domains.vehicule.controller import (
    get_list_vehicules,
    get_vehicule_infos_controller,
    delete_vehicule_controller,
)
from app.domains.vehicule.schemas import VehiculeListGrouped, VehiculeDetailResponse

# Routeur sans préfixe : garde l'URL /list_vehicules telle quelle
router = APIRouter()

@router.get("/list_vehicules", response_model=VehiculeListGrouped)
def list_vehicules_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_vehicules(token, db)


# Routeur séparé, préfixé /vehicule, pour les routes par id
vehicule_router = APIRouter()

@vehicule_router.get("/{vehicule_id}", response_model=VehiculeDetailResponse)
def vehicule_infos_endpoint(vehicule_id: int, db: Session = Depends(get_db)):
    return get_vehicule_infos_controller(vehicule_id, db)


@vehicule_router.delete("/{vehicule_id}", response_model=bool)
def delete_vehicule_endpoint(
    vehicule_id: int,
    db: Session = Depends(get_db)
):
    return delete_vehicule_controller(vehicule_id, db)