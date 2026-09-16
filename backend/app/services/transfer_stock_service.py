from sqlalchemy.orm import Session

from app.database.models import Stock, StockEvent
from app.enums.stock_event_type_enum import StockEventType


def transfer_stock_service(
    stock_id: int, target_center_id: int, user_id: int, db: Session
) -> Stock | None:
    stock = db.query(Stock).filter(Stock.id == stock_id).one_or_none()
    if not stock:
        return None

    stock.center_id = target_center_id

    db.add(
        StockEvent(
            stock_id=stock.id,
            user_id=user_id,
            event_type=StockEventType.TRANSFERT_ENVOYE,
            details=f"Transfert vers le centre {target_center_id}",
        )
    )

    db.commit()
    db.refresh(stock)
    return stock
