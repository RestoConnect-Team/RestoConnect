from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base

from app.enums import InventoryStockStatus

class InventoryStock (Base):
    __tablename__="inventory_stock"
    id = Column(Integer, primary_key=True)

  
    status = Column(SQLEnum(InventoryStockStatus))

    stock_id = Column(Integer, ForeignKey('stock.id'))
    stock = relationship("Stock")

    scan_id = Column(Integer, ForeignKey('scan.id'), nullable=True)
    scan = relationship("Scan")

    inventory_id = Column(Integer, ForeignKey('inventory.id'))
    inventory = relationship("Inventory")

