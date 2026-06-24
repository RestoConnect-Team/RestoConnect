from sqlalchemy import select, func
from sqlalchemy.orm import Session

from app.database.models import Vehicule, VehiculeDocument


def get_list_vehicules_service(db: Session):
    query = (
        select(
            Vehicule,
            func.count(VehiculeDocument.id).label("document_count")
        )
        .outerjoin(VehiculeDocument)
        .group_by(Vehicule.id)
    )
    return db.execute(query).all()