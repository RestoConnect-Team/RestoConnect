from pydantic import BaseModel
from typing import Literal

from app.enums import InventoryStockStatus


class InventoryStockStatusUpdate(BaseModel):
    status: Literal[InventoryStockStatus.FOUND, InventoryStockStatus.NOT_FOUND]
