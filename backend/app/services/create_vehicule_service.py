from datetime import date

from sqlalchemy.orm import Session

from app.database.models import Vehicule


def create_vehicule_service(payload, center_id: int, db: Session) -> Vehicule:
    today = date.today()
    next_year = date(today.year + 1, today.month, today.day)
    vehicule = Vehicule(
        name=payload.name,
        immatriculation=payload.immatriculation,
        category=payload.category,
        status=payload.status,
        nb_km=payload.nb_km or 0,
        last_technical_inspection_date=today,
        next_technical_inspection_date=next_year,
        center_id=center_id,
    )
    db.add(vehicule)
    db.commit()
    db.refresh(vehicule)
    return vehicule
