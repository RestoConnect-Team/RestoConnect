from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import delete_vehicule_service, get_user_by_token_service
from app.database.models import Vehicule


def delete_vehicule_controller(
    vehicule_id: int, token: str | None, db: Session
) -> bool:
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

    if not delete_vehicule_service(vehicule_id, db):
        raise HTTPException(status_code=404, detail="Vehicule not found")
    return True
