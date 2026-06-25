from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services.get_vehicule_infos_service import get_vehicule_infos_service
from app.schemas import VehiculeDetailResponse

def get_vehicule_infos_controller(vehicule_id: int, db: Session) -> VehiculeDetailResponse:
    
    vehicule_infos = get_vehicule_infos_service(vehicule_id, db)

    if not vehicule_infos:
        raise HTTPException(status_code=404, detail="Vehicule not found")

    return vehicule_infos