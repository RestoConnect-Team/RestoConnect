from sqlalchemy import Column, Integer, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base

from app.enums import InventoryStockStatus


class VehiculeInventoryItem(Base):
    __tablename__ = "vehicule_inventory_item"

    id = Column(Integer, primary_key=True)
    status = Column(SQLEnum(InventoryStockStatus))

    vehicule_id = Column(Integer, ForeignKey("vehicule.id"))
    vehicule = relationship("Vehicule")

    inventory_id = Column(Integer, ForeignKey("vehicule_inventory.id"))
    inventory = relationship("VehiculeInventory", back_populates="items")
