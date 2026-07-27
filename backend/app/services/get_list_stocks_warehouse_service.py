from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Stock, Center 



def get_list_stocks_warehouse_service( db: Session ):

    
    equipement_list_query = select(Stock).where(Stock.center_id in select(Center.id).where(Center.is_warehouse == True))
    

    return db.scalars(equipement_list_query).all()