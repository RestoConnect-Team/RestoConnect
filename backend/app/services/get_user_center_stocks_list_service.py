from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Stock, User



def get_user_center_stocks_list_service(user: User, db: Session):
    
    equipement_list_query = select(Stock).where(Stock.center_id == user.center_id)

    return db.scalars(equipement_list_query).all()