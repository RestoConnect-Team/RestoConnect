from sqlalchemy import Column, Integer, String, ForeignKey,Date, Enum as SQLEnum
from sqlalchemy.orm import relationship
from ..connection import Base

from app.enums import UserStatus

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
    street_number = Column(Integer, nullable=True)
    street = Column(String, nullable=True)
    city = Column(String, nullable=True)
    postal_code = Column(String, nullable=True)
    #status
    status = Column(SQLEnum(UserStatus))
    # creation date
    created_at = Column(Date, nullable=True)
    # update date
    updated_at = Column(Date, nullable=True)

    # identity photo
    photo_url = Column(String, nullable=True)

    #foreign key
    center_id = Column(Integer, ForeignKey('center.id'))
    center = relationship("Center")