from sqlalchemy import Column, Integer, String
from ..connection import Base

class Stock(Base):
    __tablename__ = "stock"
    id = Column(Integer, primary_key=True)
    reference = Column(String, unique=True)
    name = Column(String)
    categorie = Column(String)
    quantity = Column(Integer)
    

