from pydantic import BaseModel
from typing import Optional


from app.enums import StockCategory, InventoryStockStatus


class OneStockFromInventory(BaseModel):
    inventory_stock_id : int
    
    reference: str
    name: str
    category : StockCategory
    qr_code : str

    status_inventory_stock : InventoryStockStatus