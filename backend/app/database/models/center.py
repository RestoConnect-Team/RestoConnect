from sqlalchemy import Column, Integer, String
from ..connection import Base

class Center(Base):
    __tablename__ = "center"
    id = Column(Integer, primary_key=True)
    name = Column(String, unique=True)
    location = Column(String)
    notification = Column(String)
    alerte = Column(String)
    