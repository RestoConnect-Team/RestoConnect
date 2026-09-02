from datetime import date

from sqlalchemy.orm import Session

from app.database.models import Vehicule


def create_vehicule_service(payload, center_id: int, db: Session) -> Vehicule:
    vehicule = Vehicule(
        name=payload.name,
        immatriculation=payload.immatriculation,
        category=payload.category,
        status=payload.status,
        nb_km=payload.nb_km or 0,
        last_technical_inspection_date=date.today(),
        next_technical_inspection_date=date.today(),
        center_id=center_id,
    )
    db.add(vehicule)
    db.commit()
    db.refresh(vehicule)
    return vehicule
