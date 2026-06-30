from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Stock, Center


def get_center_stocks_list_service(center: Center, db: Session) -> list[Stock]:
    stocks_query = select(Stock).where(Stock.center_id == center.id)

    return db.scalars(stocks_query).all()