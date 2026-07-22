from app.enums.stock_status_enum import StockStatus
from pydantic import BaseModel
from typing import Literal

class ProductScanResponse(BaseModel):
    id: int
    name: str
    reference: str
    status: str
    center_name: str

class ProductStatusUpdate(BaseModel):
    status: Literal[StockStatus.AVAILABLE, StockStatus.LOST]