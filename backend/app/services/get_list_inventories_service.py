from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Inventory, User



def get_user_center_inventories_list_service(user: User, db: Session):
    
    inventory_list_query = select(Inventory).where(Inventory.center_id == user.center_id)

    return db.scalars(inventory_list_query).all()