from sqlalchemy import Column, Integer, String, ForeignKey, Enum as SQLEnum
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
    #status Ouvert / fermer / arrêt saisonier
    status = Column(SQLEnum(CenterStatus))

    # Description centre
    description = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey('user.id'))
    user = relationship("User")

    schedules = relationship(
        "CenterSchedule",
        back_populates="center",
        cascade="all, delete-orphan"
    )
    