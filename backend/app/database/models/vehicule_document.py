from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..connection import Base


class VehiculeDocument(Base):
    __tablename__ = "vehicule_documents"

    id = Column(Integer, primary_key=True)
    filename = Column(String)
    file_url = Column(String, nullable=True)

    vehicule_id = Column(
        Integer,
        ForeignKey("vehicule.id")
    )

    vehicule = relationship(
        "Vehicule",
        back_populates="vehicule_documents"
    )
    