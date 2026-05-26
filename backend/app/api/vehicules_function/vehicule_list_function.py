from typing import Optional

from fastapi import HTTPException
from sqlalchemy import select, func
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.models import User, Vehicule, VehiculeDocument


class VehiculeListResponse(BaseModel):
    id: int
    name: str
    location: Optional[str]

    center_name: Optional[str]

    responsable_name: Optional[str]
    responsable_email: Optional[str]

    has_documents: bool


def get_list_vehicules(token: str, db: Session):

    user = db.scalar(
        select(User).where(User.token == token)
    )

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    query = (
        select(
            Vehicule,
            func.count(VehiculeDocument.id).label("document_count")
        )
        .outerjoin(VehiculeDocument)
        .group_by(Vehicule.id)
    )

    results = db.execute(query).all()

    vehicules_center: list[VehiculeListResponse] = []
    vehicules_other: list[VehiculeListResponse] = []

    for vehicule, document_count in results:

        vehicule_data = VehiculeListResponse(
            id=vehicule.id,
            name=vehicule.name,
            location=vehicule.location,

            center_name=vehicule.center.name if vehicule.center else None,

            responsable_name=vehicule.user.name if vehicule.user else None,
            responsable_email=vehicule.user.email if vehicule.user else None,

            has_documents=document_count > 0
        )

        if vehicule.center_id == user.center_id:
            vehicules_center.append(vehicule_data)
        else:
            vehicules_other.append(vehicule_data)

    return {
        "vehicules_center": vehicules_center,
        "vehicules_other": vehicules_other
    }