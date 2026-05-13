from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from ..connection import Base

class User(Base):
    __tablename__ = "user"
    id = Column(Integer, primary_key=True)
    password = Column(String)
    name = Column(String)
    email = Column(String, unique=True)

    #token for authentication
    token = Column(String, nullable=True)

    #foreign key
    center_id = Column(Integer, ForeignKey('center.id'))
    center = relationship("Center")