from sqlalchemy.orm import Session
from datetime import datetime
from app.database.models import Stock, StockEvent
from app.enums import StockEventType

def add_stock_event(
    db: Session,
    stock_id: int,
    event_type: StockEventType,
    user_id: int | None = None,
    details: str | None = None,
):
    """
    Enregistre un nouvel événement pour un article et met à jour la date du dernier scan.
    """
    # 1. Mettre à jour la date du dernier scan sur l'article
    stock_item = db.query(Stock).filter(Stock.id == stock_id).one()
    stock_item.last_scan_date = datetime.utcnow().date()

    # 2. Créer le nouvel événement
    new_event = StockEvent(stock_id=stock_id, user_id=user_id, event_type=event_type, details=details)
    db.add(new_event)
    
    # La session sera commitée par le controller qui appelle ce service.
    return new_event