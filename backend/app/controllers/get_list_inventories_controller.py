from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, get_user_center_inventories_list_service
from app.schemas import OneInventoryFromInventorys


def get_list_inventories_controller (token, db: Session) -> list[OneInventoryFromInventorys] :
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    list_inventories = get_user_center_inventories_list_service(user, db)

    list_inventory_stocks = []
    for inventory in list_inventories:
        list_inventory_stocks.append(
            OneInventoryFromInventorys(
                id=inventory.id,
                inventory_start_date=inventory.inventory_start_date,
                inventory_end_date=inventory.inventory_end_date,
                status=inventory.status
            )
        )
    
    return list_inventory_stocks