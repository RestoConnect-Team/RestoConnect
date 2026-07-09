from pydantic import BaseModel
from typing import Optional
from datetime import date

from app.enums import InventoryStatus


class OneInventoryFromInventorys(BaseModel):
    inventory_id : int
    start_date : date
    end_date : Optional[date]

    status_inventory_stock : InventoryStatus