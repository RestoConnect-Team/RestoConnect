from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token, get_list_vehicules_service
from app.schemas import VehiculeSchema, VehiculeListGrouped


def get_list_vehicules(token: str, db: Session) -> VehiculeListGrouped:
    user = get_user_by_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    results = get_list_vehicules_service(db)

    vehicules_center: list[VehiculeSchema] = []
    vehicules_other: list[VehiculeSchema] = []

    for vehicule, document_count in results:
        vehicule_data = VehiculeSchema(
            id=vehicule.id,
            name=vehicule.name,
            location=vehicule.location,
            center_name=vehicule.center.name if vehicule.center else None,
            responsable_name=vehicule.user.name if vehicule.user else None,
            responsable_email=vehicule.user.email if vehicule.user else None,
            has_documents=document_count > 0,
        )

        if vehicule.center_id == user.center_id:
            vehicules_center.append(vehicule_data)
        else:
            vehicules_other.append(vehicule_data)

    return VehiculeListGrouped(
        vehicules_center=vehicules_center,
        vehicules_other=vehicules_other,
    )