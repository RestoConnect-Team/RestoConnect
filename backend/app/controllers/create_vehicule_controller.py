from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service
from app.services.create_vehicule_service import create_vehicule_service
from app.schemas import VehiculeCreate, OneVehiculeFromList
from app.database.models import Vehicule


def create_vehicule_controller(
    payload: VehiculeCreate, token: str | None, db: Session
) -> OneVehiculeFromList:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    existing = (
        db.query(Vehicule)
        .filter(Vehicule.immatriculation == payload.immatriculation)
        .first()
    )
    if existing:
        raise HTTPException(status_code=400, detail="Cette immatriculation existe déjà")

    vehicule = create_vehicule_service(payload, user.center_id, db)

    return OneVehiculeFromList(
        id=vehicule.id,
        name=vehicule.name,
        immatriculation=vehicule.immatriculation,
        center_name=vehicule.center.name,
        category=vehicule.category,
        status=vehicule.status,
    )
