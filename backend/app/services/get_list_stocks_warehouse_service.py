from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Stock, Center


def get_list_stocks_warehouse_service(db: Session):

    equipement_list_query = (
        select(Stock)
        .join(Center, Stock.center_id == Center.id)
        .where(Center.is_warehouse.is_(True))
    )

    return db.scalars(equipement_list_query).all()