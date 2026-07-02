from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Center


def get_center_service(center_id: int, db: Session) -> Center | None:
    center_query = select(Center).where(Center.id == center_id)
    return db.scalar(center_query)




