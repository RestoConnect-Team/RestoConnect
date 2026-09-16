from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_user_by_token_service,
    get_user_center_inventories_list_service,
)
from app.schemas import OneInventoryFromInventorys


def get_list_inventories_controller(
    token, db: Session
) -> list[OneInventoryFromInventorys]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    list_inventories = get_user_center_inventories_list_service(user, db)

    result = []
    for inventory in list_inventories:
        result.append(
            OneInventoryFromInventorys(
                inventory_id=inventory.id,
                start_date=inventory.inventory_start_date,
                end_date=inventory.inventory_end_date,
                status_inventory_stock=inventory.status,
            )
        )

    return result
