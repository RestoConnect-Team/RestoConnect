from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_service, is_user_center_admin_service
from app.domains.inventory.service import get_user_center_inventories_list_service, get_inventory_stocks_service
from app.domains.inventory.schemas import OneStockFromInventory, OneInventoryFromInventorys
from app.services.get_user_service import get_user_by_token_service

def create_inventory_controller(token: str, db: Session) -> list[OneStockFromInventory]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not is_user_center_admin_service(user):
        raise HTTPException(status_code=403, detail="User is not the center admin")

    list_inventory_stocks = get_list_stocks_user_center_service(user, db)
    if not list_inventory_stocks:
        raise HTTPException(status_code=404, detail="No stocks found for the user's center")

    return list_inventory_stocks


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


def get_list_stocks_inventory_controller(inventory_id: int, db: Session) -> list[OneStockFromInventory]:

    inventory_stocks = get_inventory_stocks_service(inventory_id, db)
    if not inventory_stocks:
        raise HTTPException(status_code=404, detail="No stocks found for the given inventory ID")

    list_inventory_stocks = []

    for inventory_stock in inventory_stocks:
        list_inventory_stocks.append(OneStockFromInventory(
            inventory_stock_id=inventory_stock.id,
            reference=inventory_stock.stock.reference,
            name=inventory_stock.stock.name,
            category=inventory_stock.stock.category,
            qr_code=inventory_stock.stock.qr_code,
            status_inventory_stock=inventory_stock.status
        ))

    return list_inventory_stocks