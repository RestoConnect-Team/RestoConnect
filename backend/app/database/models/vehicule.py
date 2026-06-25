
from sqlalchemy import Column, Integer, String, ForeignKey, Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base
from app.enums import VehiculeCategory, VehiculeStatus





class Vehicule(Base):
    __tablename__ = "vehicule"

    id = Column(Integer, primary_key=True)

    name = Column(String)
    immatriculation = Column(String, unique=True)
    category = Column(SQLEnum(VehiculeCategory))
    status = Column(SQLEnum(VehiculeStatus))

    nb_km = Column(Integer)
    # Pour le contrôle technique
    last_technical_inspection_date = Column(Date)
    next_technical_inspection_date = Column(Date)
    # Pour la révision
    last_service_date = Column(Date, nullable=True)
    next_service_date = Column(Date, nullable=True)
        


    center_id = Column(Integer, ForeignKey('center.id'))
    center = relationship("Center")

    user_id = Column(Integer, ForeignKey('user.id'), nullable=True)
    user = relationship("User")

    vehicule_documents = relationship(
        "VehiculeDocument",
        back_populates="vehicule",
        lazy="selectin",
        cascade="all, delete-orphan"
    )
