from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.models import User, Stock

class Equipement(BaseModel):
    id: int
    reference: str
    name: str
    categorie: str
    quantity: int
    
    class Config:
        from_attributes = True



def get_user_equipement_liste_from_his_center(token: str, db: Session):
    user = db.scalar(
        select(User).where(User.token == token)
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    equipement_list_query = select(Stock).where(Stock.center_id == user.center_id)
    equipement_list = db.scalars(equipement_list_query).all()
    
    return [Equipement.model_validate(stock) for stock in equipement_list]