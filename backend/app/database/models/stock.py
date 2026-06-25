from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base

from app.enums import StockStatus,StockCategory

class Stock(Base):
    __tablename__ = "stock"
    id = Column(Integer, primary_key=True)

    name = Column(String)
    category = Column(SQLEnum(StockCategory))
    reference = Column(String, unique=True)
    qr_code = Column(String)
    status = Column(SQLEnum(StockStatus))

    creation_date = Column(Date)
    last_scan_date = Column(Date)


    center_id = Column(Integer, ForeignKey('center.id'))
    center = relationship("Center")

    
    

