from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_center_service,
    get_center_schedule_service,
    get_center_admin_service,
   
)
from app.schemas import CenterInfos


def get_center_infos_controller(center_id: int, db: Session) -> CenterInfos:
    center = get_center_service(center_id, db)

    if not center:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")


    center_schedule = get_center_schedule_service(center)
    center_admin = get_center_admin_service(center, db)

    if center_admin is None:
        raise HTTPException(status_code=404, detail="Aucun administrateur pour ce centre")


    return    CenterInfos(
        center_id=center.id,
        name=center.name,
        status=center.status,
        street_number = center.street_number,
        street=center.street,
        city=center.city,
        postal_code=center.postal_code,
        description=center.description,
        activities=center.activities,
        center_headmaster_name=center_admin.name,
        center_headmaster_lastname=center_admin.lastname,
        center_headmaster_email=center_admin.email,
        center_headmaster_telephone=center_admin.telephone,
        center_schedule=center_schedule,
    )