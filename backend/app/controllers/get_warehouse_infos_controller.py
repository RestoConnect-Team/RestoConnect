from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_center_service,
    get_center_schedule_service,
    get_center_admin_service,
    get_center_stocks_list_service,
)
from app.schemas import WarehouseInfos, OneEquipementFromList


def get_warehouse_infos_controller(warehouse_id: int, db: Session) -> WarehouseInfos:

    warehouse = get_center_service(warehouse_id, db)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Aucun entrepôt trouvé")

    warehouse_schedule = get_center_schedule_service(warehouse)
    warehouse_admin = get_center_admin_service(warehouse, db)

    if warehouse_admin is None:
        raise HTTPException(
            status_code=404, detail="Aucun administrateur pour ce centre"
        )

    stocks = get_center_stocks_list_service(warehouse, db)

    stocks_list = [
        OneEquipementFromList(
            id=s.id,
            name=s.name,
            reference=s.reference,
            category=s.category,
            status=s.status,
            qr_code=s.qr_code,
            center_name=warehouse.name,
        )
        for s in stocks
    ]

    return WarehouseInfos(
        warehouse_id=warehouse.id,
        name=warehouse.name,
        status=warehouse.status,
        street=warehouse.street,
        city=warehouse.city,
        postal_code=warehouse.postal_code,
        description=warehouse.description,
        activities=warehouse.activities,
        center_headmaster_name=warehouse_admin.name,
        center_headmaster_lastname=warehouse_admin.lastname,
        center_headmaster_email=warehouse_admin.email,
        center_headmaster_telephone=warehouse_admin.telephone,
        center_schedule=warehouse_schedule,
        stocks_list=stocks_list,
    )
