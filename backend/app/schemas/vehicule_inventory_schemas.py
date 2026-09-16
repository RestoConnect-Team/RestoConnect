from typing import Optional
from datetime import date

from pydantic import BaseModel

from app.enums import InventoryStatus, InventoryStockStatus


class OneVehiculeFromInventory(BaseModel):
    inventory_item_id: int
    vehicule_id: int
    name: str
    immatriculation: str
    status_inventory_stock: InventoryStockStatus


class VehiculeInventoryResponse(BaseModel):
    inventory_id: int
    start_date: date
    end_date: Optional[date]
    status: InventoryStatus
    items: list[OneVehiculeFromInventory]
