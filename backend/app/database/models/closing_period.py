from sqlalchemy import Column, Integer, Date, ForeignKey
from sqlalchemy.orm import relationship
from ..connection import Base


class ClosingPeriod(Base):
    __tablename__ = "closing_period"

    id = Column(Integer, primary_key=True)
    center_id = Column(Integer, ForeignKey("center.id"), nullable=False)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)

    center = relationship("Center", back_populates="closing_periods")
