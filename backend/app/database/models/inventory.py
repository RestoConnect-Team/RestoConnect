from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base
from datetime import date

from app.enums import InventoryStatus

class Inventory (Base):
    __tablename__="inventory"
    id = Column(Integer, primary_key=True)

    inventory_start_date = Column( Date, default= date.today )
    inventory_end_date = Column(Date, nullable=True)
    status = Column(SQLEnum(InventoryStatus))

    center_id = Column(Integer, ForeignKey('center.id'))
    center = relationship("Center")

    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship("User")
