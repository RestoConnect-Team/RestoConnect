from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Center

def get_list_centers_service(db : Session) :

    list_centers_query = select(Center)

    return db.scalars(list_centers_query).all()