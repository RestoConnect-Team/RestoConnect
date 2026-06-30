from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_list_centers_service,
    get_center_schedule_service,
    get_center_admin_service,
    get_center_stocks_list_service,
)
from app.schemas import CenterInfos, WarehouseInfos, OneEquipementFromList, ListCentersResponse


def get_list_centers_controller(db: Session) -> ListCentersResponse:
    list_centers = get_list_centers_service(db)

    if not list_centers:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")

    centers: list[CenterInfos] = []
    warehouses: list[WarehouseInfos] = []

    for center in list_centers:
        center_schedule = get_center_schedule_service(center)
        center_admin = get_center_admin_service(center, db)

        if center_admin is None:
            # Centre sans admin assigné : on l'ignore pour ne pas casser la réponse
            continue

        if center.is_warehouse:
            warehouse_stock = get_center_stocks_list_service(center, db)

            list_stock = [
                OneEquipementFromList(
                    id=stock.id,
                    name=stock.name,
                    reference=stock.reference,
                    category=stock.category,
                    status=stock.status,
                    qr_code=stock.qr_code,
                )
                for stock in warehouse_stock
            ]

            warehouses.append(
                WarehouseInfos(
                    warehouse_id=center.id,
                    name=center.name,
                    status=center.status,
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
                    stocks_list=list_stock,
                )
            )
        else:
            centers.append(
                CenterInfos(
                    center_id=center.id,
                    name=center.name,
                    status=center.status,
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
            )

    if not centers and not warehouses:
        raise HTTPException(
            status_code=404,
            detail="Aucun centre avec un administrateur assigné n'a été trouvé",
        )

    return ListCentersResponse(centers_list=centers, warehouses_list=warehouses)