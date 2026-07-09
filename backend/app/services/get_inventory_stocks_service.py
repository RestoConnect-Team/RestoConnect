from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import InventoryStock


def get_inventory_stocks_service(inventory_id: int, db: Session) -> list[InventoryStock]:

    inventory_stocks_query = select(InventoryStock).where(InventoryStock.inventory_id == inventory_id)

    return db.scalars(inventory_stocks_query).all()