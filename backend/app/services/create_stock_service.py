from datetime import date

from sqlalchemy.orm import Session

from app.database.models import Stock, StockEvent
from app.enums import StockStatus
from app.enums.stock_event_type_enum import StockEventType


def create_stock_service(payload, center_id: int, db: Session) -> Stock:
    stock = Stock(
        name=payload.name,
        category=payload.category,
        reference=payload.reference,
        qr_code=payload.reference,
        status=StockStatus.AVAILABLE,
        creation_date=date.today(),
        last_scan_date=date.today(),
        description=payload.description,
        center_id=center_id,
    )
    db.add(stock)
    db.flush()

    db.add(
        StockEvent(
            stock_id=stock.id,
            event_type=StockEventType.AJOUT_SYSTEME,
            details="Ajout initial au système",
        )
    )

    db.commit()
    db.refresh(stock)
    return stock
