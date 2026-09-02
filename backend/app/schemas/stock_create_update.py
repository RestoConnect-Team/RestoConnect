from typing import Optional

from pydantic import BaseModel

from app.enums import StockCategory


class StockCreate(BaseModel):
    name: str
    category: StockCategory
    reference: str
    description: Optional[str] = None


class StockUpdate(BaseModel):
    name: Optional[str] = None
    category: Optional[StockCategory] = None
    reference: Optional[str] = None
    description: Optional[str] = None
