from pydantic import BaseModel

from app.enums import StockCategory, StockStatus

class OneEquipementFromList(BaseModel):
    id: int
    reference: str
    name: str
    category : StockCategory
    status : StockStatus
    qr_code : str


    
    class Config:
        from_attributes = True
