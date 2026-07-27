from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.controllers import get_vehicule_infos_controller
from app.schemas import VehiculeDetailResponse

from app.database.connection import get_db

router = APIRouter()

@router.get("/{vehicule_id}", response_model=VehiculeDetailResponse)
def vehicule_infos_endpoint(vehicule_id: int, db: Session = Depends(get_db)):
    return get_vehicule_infos_controller(vehicule_id, db)