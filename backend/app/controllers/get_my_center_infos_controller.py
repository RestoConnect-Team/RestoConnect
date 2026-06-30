from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_my_center_service,
    get_user_by_token_service,
    get_center_schedule_service,
    get_center_admin_service,
)
from app.schemas import CenterInfos


def get_my_center_infos_controller(token: str, db: Session) -> CenterInfos:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    my_center = get_my_center_service(user, db)
    if not my_center:
        raise HTTPException(status_code=404, detail="User has no center assigned")

    schedule = get_center_schedule_service(my_center)
    center_admin = get_center_admin_service(my_center, db)

    if center_admin is None:
        raise HTTPException(status_code=404, detail="Center has no admin assigned")

    return CenterInfos(
        center_id=my_center.id,
        name=my_center.name,
        status=my_center.status,
        street=my_center.street,
        city=my_center.city,
        postal_code=my_center.postal_code,
        description=my_center.description,
        activities=my_center.activities,
        center_headmaster_name=center_admin.name,
        center_headmaster_lastname=center_admin.lastname,
        center_headmaster_email=center_admin.email,
        center_headmaster_telephone=center_admin.telephone,
        center_schedule=schedule,
    )