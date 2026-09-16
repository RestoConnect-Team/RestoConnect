from fastapi import HTTPException
from sqlalchemy import func, select
from sqlalchemy.orm import Session

from app.services import (
    get_list_centers_service,
    get_my_center_service,
    get_user_by_token_service,
)
from app.schemas import OneCenterFromList, ListCentersResponse
from app.database.models import Stock, User


def _get_counts(center_id: int, db: Session):
    materials_count = (
        db.scalar(select(func.count(Stock.id)).where(Stock.center_id == center_id)) or 0
    )
    contacts_count = (
        db.scalar(select(func.count(User.id)).where(User.center_id == center_id)) or 0
    )
    return materials_count, contacts_count


def get_list_centers_controller(token: str, db: Session) -> ListCentersResponse:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    list_centers = get_list_centers_service(db)

    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_center = get_my_center_service(user, db)
    if not user_center:
        raise HTTPException(status_code=404, detail="User has no center assigned")

    if not list_centers:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")

    uc_materials, uc_contacts = _get_counts(user_center.id, db)
    user_center_item: OneCenterFromList = OneCenterFromList(
        center_id=user_center.id,
        name=user_center.name,
        status=user_center.status,
        city=user_center.city,
        materials_count=uc_materials,
        contacts_count=uc_contacts,
    )
    centers: list[OneCenterFromList] = []
    warehouses: list[OneCenterFromList] = []

    for center in list_centers:
        mat_count, con_count = _get_counts(center.id, db)

        if center.is_warehouse:
            warehouses.append(
                OneCenterFromList(
                    center_id=center.id,
                    name=center.name,
                    status=center.status,
                    city=center.city,
                    materials_count=mat_count,
                    contacts_count=con_count,
                )
            )

        elif center.id == user_center_item.center_id:
            continue
        else:
            centers.append(
                OneCenterFromList(
                    center_id=center.id,
                    name=center.name,
                    status=center.status,
                    city=center.city,
                    materials_count=mat_count,
                    contacts_count=con_count,
                )
            )

    if not centers and not warehouses:
        raise HTTPException(
            status_code=404,
            detail="Aucun centre avec un administrateur assigné n'a été trouvé",
        )

    return ListCentersResponse(
        user_center=user_center_item, centers_list=centers, warehouses_list=warehouses
    )
