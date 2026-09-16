from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service
from app.services.update_vehicule_service import update_vehicule_service
from app.schemas import VehiculeUpdate, OneVehiculeFromList
from app.database.models import Vehicule


def update_vehicule_controller(
    vehicule_id: int, payload: VehiculeUpdate, token: str | None, db: Session
) -> OneVehiculeFromList:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    vehicule = db.query(Vehicule).filter(Vehicule.id == vehicule_id).one_or_none()
    if not vehicule:
        raise HTTPException(status_code=404, detail="Vehicule not found")
    if vehicule.center_id != user.center_id:
        raise HTTPException(status_code=403, detail="Accès refusé à ce véhicule")

    updated = update_vehicule_service(vehicule_id, payload, db)
    if not updated:
        raise HTTPException(status_code=404, detail="Vehicule not found")

    return OneVehiculeFromList(
        id=updated.id,
        name=updated.name,
        immatriculation=updated.immatriculation,
        center_name=updated.center.name,
        category=updated.category,
        status=updated.status,
    )
