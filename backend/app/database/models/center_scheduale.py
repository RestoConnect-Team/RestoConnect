from sqlalchemy import Column, Integer, ForeignKey, Time, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base

from app.enums import WeekDays

class CenterSchedule(Base):
    __tablename__ = "center_schedule"

    id = Column(Integer, primary_key=True)

    center_id = Column(Integer, ForeignKey("center.id"))

    day_of_week = Column(SQLEnum(WeekDays))  

    opening_time = Column(Time)
    closing_time = Column(Time)

    center = relationship(
        "Center",
        back_populates="schedules"
    )