from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import delete_vehicule_service


def delete_vehicule_controller(vehicule_id: int, db: Session) -> bool:
    if not delete_vehicule_service(vehicule_id, db):
        raise HTTPException(status_code=404, detail="Vehicule not found")
    return delete_vehicule_service(vehicule_id, db)