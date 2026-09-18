from datetime import date
from pydantic import BaseModel
from typing import Optional
from app.domains.stock.schemas import StockCategory
from app.domains.inventory.enums import InventoryStockStatus
from app.domains.inventory.enums import InventoryStatus



class OneStockFromInventory(BaseModel):
    inventory_stock_id : int
    
    reference: str
    name: str
    category : StockCategory
    qr_code : str

    status_inventory_stock : InventoryStockStatus


class OneInventoryFromInventorys(BaseModel):
    inventory_id : int
    start_date : date
    end_date : Optional[date]

    status_inventory_stock : InventoryStatus