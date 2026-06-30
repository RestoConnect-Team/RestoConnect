from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_list_centers_service, get_center_schedule_service, get_center_admin_service, get_center_stocks_list_service
from app.schemas import CenterInfos, WarehouseInfos, OneEquipementFromList, ListCentersResponse


def get_list_centers_controller( db: Session) -> ListCentersResponse:
   

    list_centers = get_list_centers_service(db)

    centers: list[CenterInfos] = []
    warehouses: list[WarehouseInfos] = []

    for center in list_centers:
        center_schedule = get_center_schedule_service(center)
        center_admin = get_center_admin_service(center)
        if center.is_warehouse :
            warehouse_stock = get_center_stocks_list_service(center)
            list_stock = []
            for stock in warehouse_stock :
                list_stock.append(OneEquipementFromList(
                    id=stock.id,
                    name=stock.name,
                    reference=stock.reference,
                    category=stock.category,
                    status=stock.status,
                    qr_code=stock.qr_code
                    )
                )

            warehouses.append(
                WarehouseInfos(
                    id = center.id,
                    name = center.name,
                    category = center.category,
                    status = center.status,
                    street = center.street,  
                    city = center.city,
                    postal_code = center.postal_code,

                    description = center.description,
                    activities = center.activities,

                    center_headmaster_name = center_admin.name,
                    center_headmaster_lastname = center_admin.lastname,
                    center_headmaster_email = center_admin.email,
                    center_headmaster_telephone = center_admin.telephone,

                    center_schedule = center_schedule,

                    stocks_list = list_stock

                )
            )

        else :
            centers.append(
                CenterInfos(
                    id = center.id,
                    name = center.name,
                    category = center.category,
                    status = center.status,
                    street = center.street,  
                    city = center.city,
                    postal_code = center.postal_code,

                    description = center.description,
                    activities = center.activities,

                    center_headmaster_name = center_admin.name,
                    center_headmaster_lastname = center_admin.lastname,
                    center_headmaster_email = center_admin.email,
                    center_headmaster_telephone = center_admin.telephone,

                    center_schedule = center_schedule
                )
            )



    return ListCentersResponse(centers_list = centers, warehouses_list = warehouses)