from pydantic import BaseModel
from typing import List, Optional
import datetime
from app.enums import StockStatus, StockCategory

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