from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..connection import Base

class StockScanHistoric (Base):
    __tablename__="stock_scan_historic"
    id = Column(Integer, primary_key=True)

    scan_date = Column(Date)

    stock_id = Column(Integer, ForeignKey('stock.id'))
    stock = relationship("Stock")

    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship("User")

