from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..connection import Base

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    #token for authentication
    token = Column(String, nullable=True)
    # Private
    password = Column(String)
    # personal information
    name = Column(String)
    lastname = Column(String, nullable=True)
    email = Column(String, unique=True)
    telephone = Column(String, nullable=True)
    #adresse
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    #status
    status = Column(String)
    # creation date
    created_at = Column(String, nullable=True)
    # update date
    updated_at = Column(String, nullable=True)

    # identity photo
    photo_url = Column(String, nullable=True)

    #foreign key
    center_id = Column(Integer, ForeignKey('center.id'))
    center = relationship("Center")