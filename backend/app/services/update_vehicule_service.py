from sqlalchemy.orm import Session

from app.database.models import Vehicule


def update_vehicule_service(vehicule_id: int, payload, db: Session) -> Vehicule | None:
    vehicule = db.query(Vehicule).filter(Vehicule.id == vehicule_id).one_or_none()
    if not vehicule:
        return None

    if payload.name is not None:
        vehicule.name = payload.name
    if payload.immatriculation is not None:
        vehicule.immatriculation = payload.immatriculation
    if payload.category is not None:
        vehicule.category = payload.category
    if payload.status is not None:
        vehicule.status = payload.status
    if payload.nb_km is not None:
        vehicule.nb_km = payload.nb_km

    db.commit()
    db.refresh(vehicule)
    return vehicule
