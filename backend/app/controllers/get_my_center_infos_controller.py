from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token, get_my_center_infos_service, schedule_to_dict, get_center_admin
from app.schemas import OneEquipementFromList, CenterInfos


def get_my_center_infos_controller(token: str, db: Session) -> list[OneEquipementFromList]:
    user = get_user_by_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    my_center = get_my_center_infos_service(user, db)

    if not my_center :
            raise HTTPException(status_code=401, detail="User has no my_center")
    
    schedule = schedule_to_dict(my_center) 
    center_admin = get_center_admin(my_center, db)

    return CenterInfos(
            id = my_center.id,
            name = my_center.name,
            category = my_center.category,
            status = my_center.status,
            street = my_center.street,  
            city = my_center.city,
            postal_code = my_center.postal_code,

            description = my_center.description,
            activities = my_center.activities,

            center_headmaster_name = center_admin.name,
            center_headmaster_lastname = center_admin.lastname,
            center_headmaster_email = center_admin.email,
            center_headmaster_telephone = center_admin.telephone,

            center_schedule = schedule
            )
