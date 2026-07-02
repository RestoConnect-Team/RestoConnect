from sqlalchemy import Column, Integer, String, Boolean, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base

from app.enums import CenterStatus

class Center(Base):
    __tablename__ = "center"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    #adresse
    street_number = Column(Integer, nullable=True)
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    # contact
    telephone = Column(String, nullable=True)
    email = Column(String, nullable=True)
    #status Ouvert / fermer / arrêt saisonier
    status = Column(SQLEnum(CenterStatus))

    # Description centre
    description = Column(String, nullable=True)
    activities = Column(String, nullable=True)

    # If the center is a warehouse
    is_warehouse = Column(Boolean, default=False, nullable=False)

    schedules = relationship(
        "CenterSchedule",
        back_populates="center",
        cascade="all, delete-orphan"
    )
    closing_periods = relationship(
        "ClosingPeriod",
        back_populates="center",
        cascade="all, delete-orphan"
    )
    