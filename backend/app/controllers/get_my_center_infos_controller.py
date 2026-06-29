from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token, get_my_center_infos_service, schedule_to_dict
from app.schemas import OneEquipementFromList, CenterInfos


def get_my_center_infos_controller(token: str, db: Session) -> list[OneEquipementFromList]:
    user = get_user_by_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    my_center = get_my_center_infos_service(user, db)

    if not my_center :
            raise HTTPException(status_code=401, detail="User has no my_center")
    
    schedule = schedule_to_dict(my_center)

    CenterInfos(
            id = my_center.id,
            name = my_center.name,
            category = my_center.category,
            status = my_center.status,
            street = my_center.street,  
            city = my_center.city
            postal_code = my_center.postal_code
            description = my_center.description

            center_headmaster_name = my_center.
            center_headmaster_lastname : str
            center_headmaster_email : str
            center_headmaster_number : str

            center_schedule : WeeklySchedule
            )


    return response