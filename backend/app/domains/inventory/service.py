from datetime import datetime

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import User, Inventory, InventoryStock
from app.domains.inventory.enums import InventoryStatus, InventoryStockStatus
from app.domains.inventory.schemas import OneStockFromInventory


def get_inventory_stocks_service(inventory_id: int, db: Session) -> list[InventoryStock]:

    inventory_stocks_query = select(InventoryStock).where(InventoryStock.inventory_id == inventory_id)

    return db.scalars(inventory_stocks_query).all()


def create_inventory_service(user: User, db: Session) -> list[OneStockFromInventory]:

    create_inventory = Inventory(
        inventory_start_date=datetime.now(),   # ou datetime.utcnow()
        status=InventoryStatus.ON_GOING,
        center_id=user.center_id,
        user_id=user.id
    )

    db.add(create_inventory)
    db.commit()
    db.refresh(create_inventory)

    existing_stocks = get_list_stocks_user_center_service(user, db)

    create_inventory_stocks = []

    for stock in existing_stocks:
        inventory_stock = InventoryStock(
            status=InventoryStockStatus.NOT_FOUND,
            stock_id=stock.id,
            scan_id=None,
            inventory_id=create_inventory.id
        )
        create_inventory_stocks.append(inventory_stock)

    db.add_all(create_inventory_stocks)
    db.commit()

    # Les IDs sont maintenant générés
    list_inventory_stocks = []

    for inventory_stock, stock in zip(create_inventory_stocks, existing_stocks):
        db.refresh(inventory_stock)

        list_inventory_stocks.append(
            OneStockFromInventory(
                inventory_stock_id=inventory_stock.id,
                reference=stock.reference,
                name=stock.name,
                category=stock.category,
                qr_code=stock.qr_code,
                status_inventory_stock=inventory_stock.status,
            )
        )

    return list_inventory_stocks


def get_user_center_inventories_list_service(user: User, db: Session):

    inventory_list_query = select(Inventory).where(Inventory.center_id == user.center_id)

    return db.scalars(inventory_list_query).all()