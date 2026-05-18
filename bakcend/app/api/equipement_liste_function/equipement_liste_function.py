
from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import User, Stock, Center

def get_user_equipement_liste_from_his_center(token: str, db: Session):
    user = db.scalar(
        select(User).where(User.token == token)
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    equipement_list_query = select(Stock).where(Stock.center_id == user.center_id)
    equipement_list = db.scalars(equipement_list_query).all()
    print(equipement_list)
    return [
    {
        "id": stock.id,
        "reference": stock.reference,
        "name": stock.name,
        "categorie" : stock.categorie,
        "quantity": stock.quantity
    }
    for stock in equipement_list
]