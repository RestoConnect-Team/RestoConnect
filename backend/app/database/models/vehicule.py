from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..connection import Base


class Vehicule(Base):
    __tablename__ = "vehicule"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    location = Column(String)
    alerte = Column(String)
    category = Column(String)


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
