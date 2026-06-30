from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Center, User


def get_my_center_service(user: User, db: Session) -> Center | None:
    my_center_query = select(Center).where(Center.id == user.center_id)
    return db.scalar(my_center_query)




