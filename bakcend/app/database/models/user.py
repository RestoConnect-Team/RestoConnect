from sqlalchemy import Column, Integer, String
from ..connection import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True)
    password = Column(String)
    name = Column(String)
    email = Column(String, unique=True)