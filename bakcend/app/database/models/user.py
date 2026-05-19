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
    lastname = Column(String)
    email = Column(String, unique=True)
    telephone = Column(String)
    #adresse
    street = Column(String)
    city = Column(String)
    postal_code = Column(String)
    #status
    status = Column(String)
    # creation date
    created_at = Column(String)
    # update date
    updated_at = Column(String)

    # identity photo
    photo_url = Column(String)

    #foreign key
    center_id = Column(Integer, ForeignKey('center.id'))
    center = relationship("Center")