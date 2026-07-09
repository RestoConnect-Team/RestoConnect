from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_inventory_stocks_service
from app.schemas import OneStockFromInventory


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