from sqlalchemy import Column, Integer, String, ForeignKey, DateTime, Enum
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from ..connection import Base
from app.enums.stock_event_type_enum import StockEventType

class StockEvent(Base):
    __tablename__ = "stock_events"

    id = Column(Integer, primary_key=True)
    
    stock_id = Column(Integer, ForeignKey("stock.id"), nullable=False, index=True)
    user_id = Column(Integer, ForeignKey("user.id"), nullable=True)

    event_type = Column(Enum(StockEventType), nullable=False)
    details = Column(String, nullable=True)
    event_date = Column(DateTime(timezone=True), server_default=func.now())

    stock = relationship("Stock", back_populates="events")
    user = relationship("User")

    def __repr__(self):
        return f"<StockEvent(id={self.id}, stock_id={self.stock_id}, type='{self.event_type}')>"