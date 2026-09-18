from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.domains.vehicule.services import get_list_vehicules_service, get_vehicule_infos_service, delete_vehicule_service
from app.domains.vehicule.schemas import OneVehiculeFromList, VehiculeListGrouped, VehiculeDetailResponse
from app.services.get_user_service import get_user_by_token_service


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

def get_vehicule_infos_controller(vehicule_id: int, db: Session) -> VehiculeDetailResponse:
    
    vehicule_infos = get_vehicule_infos_service(vehicule_id, db)

    if not vehicule_infos:
        raise HTTPException(status_code=404, detail="Vehicule not found")

    return vehicule_infos


def delete_vehicule_controller(vehicule_id: int, db: Session) -> bool:
    if not delete_vehicule_service(vehicule_id, db):
        raise HTTPException(status_code=404, detail="Vehicule not found")
    return delete_vehicule_service(vehicule_id, db)