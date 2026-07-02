from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_list_centers_service,
    get_my_center_service
)
from app.schemas import OneCenterFromList, ListCentersResponse


def get_list_centers_controller(token: str, db: Session) -> ListCentersResponse:
    list_centers = get_list_centers_service(db)

    user_center = get_my_center_service(token, db)

    if not list_centers:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")
    

    user_center : OneCenterFromList = OneCenterFromList(
        center_id=user_center.id,
        name=user_center.name,
        status=user_center.status,
        city=user_center.city
    )
    centers: list[OneCenterFromList] = []
    warehouses: list[OneCenterFromList] = []

    for center in list_centers:

        if center.is_warehouse:

            warehouses.append(
                OneCenterFromList(
                    center_id=center.id,
                    name=center.name,
                    status=center.status,
                    city=center.city
                    
                )
            )
        
        if center.id == user_center.id:
            continue
        else:
            centers.append(
                OneCenterFromList(
                    center_id=center.id,
                    name=center.name,
                    status=center.status,
                    city=center.city
                )
            )

    if not centers and not warehouses:
        raise HTTPException(
            status_code=404,
            detail="Aucun centre avec un administrateur assigné n'a été trouvé",
        )

    return ListCentersResponse(user_center=user_center, centers_list=centers, warehouses_list=warehouses)