from typing import List, Optional, Literal
import datetime

from pydantic import BaseModel

from app.domains.stock.enums import StockCategory, StockStatus


class OneEquipementFromList(BaseModel):
    id: int
    reference: str
    name: str
    category: StockCategory
    status: StockStatus
    qr_code: str
    center_name: str

    class Config:
        from_attributes = True


class ProductScanResponse(BaseModel):
    id: int
    name: str
    reference: str
    status: str
    center_name: str


class ProductStatusUpdate(BaseModel):
    status: Literal[StockStatus.AVAILABLE, StockStatus.LOST]


class ProductHistoryItem(BaseModel):
    """
    Représente un événement dans l'historique d'un produit.
    """
    event_type: str
    details: str
    stock_date: datetime.datetime
    user_name: str


class ProductDetail(BaseModel):
    """
    Contient les informations détaillées d'un produit.
    """
    id: int
    name: str
    reference: str
    status: StockStatus
    category: StockCategory
    center_name: str
    added_date: datetime.date
    description: Optional[str] = None
    rating: Optional[int] = None


class ProductDetailResponse(BaseModel):
    details: ProductDetail
    history: List[ProductHistoryItem]

