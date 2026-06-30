from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, get_list_vehicules_service
from app.schemas import OneVehiculeFromList, VehiculeListGrouped


def get_list_vehicules(token: str, db: Session) -> VehiculeListGrouped:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    results = get_list_vehicules_service(db)

    vehicules_center: list[OneVehiculeFromList] = []
    vehicules_other: list[OneVehiculeFromList] = []

    for vehicule, document_count in results:
        vehicule_data = OneVehiculeFromList(
            id=vehicule.id,
            name=vehicule.name,
            immatriculation=vehicule.immatriculation,
            center_name=vehicule.center.name if vehicule.center else None,
            category=vehicule.category,
            status=vehicule.status
        )

        if vehicule.center_id == user.center_id:
            vehicules_center.append(vehicule_data)
        else:
            vehicules_other.append(vehicule_data)

    return VehiculeListGrouped(
        vehicules_center=vehicules_center,
        vehicules_other=vehicules_other,
    )