from sqlalchemy import Column, Integer, String, ForeignKey, Date
from sqlalchemy.orm import relationship
from ..connection import Base



class VehiculeDocument(Base):
    __tablename__ = "vehicule_documents"

    id = Column(Integer, primary_key=True)

    file_name = Column(String)
    description = Column(String, nullable=True)
    # est enregistrer automatiquement à la date de l'upload du fichier
    upload_date = Column(Date)
    # doit être renseigner par l'utilisateur
    file_date = Column(Date)
    # si présence d'une date d'expiration du document
    expiration_date = Column(Date, nullable=True)


    file_url = Column(String, nullable=True)

    vehicule_id = Column(
        Integer,
        ForeignKey("vehicule.id")
    )

    vehicule = relationship(
        "Vehicule",
        back_populates="vehicule_documents"
    )
    