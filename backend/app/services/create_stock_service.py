from datetime import date

from sqlalchemy.orm import Session

from app.database.models import Stock
from app.enums import StockStatus


def create_stock_service(payload, center_id: int, db: Session) -> Stock:
    stock = Stock(
        name=payload.name,
        category=payload.category,
        reference=payload.reference,
        qr_code=payload.reference,
        status=StockStatus.AVAILABLE,
        creation_date=date.today(),
        description=payload.description,
        center_id=center_id,
    )
    db.add(stock)
    db.commit()
    db.refresh(stock)
    return stock
