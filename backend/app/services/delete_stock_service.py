from sqlalchemy.orm import Session
from app.database.models import Stock, StockEvent, Scan, InventoryStock


def delete_stock_service(stock_id: int, db: Session) -> bool:
    stock = db.query(Stock).filter(Stock.id == stock_id).one_or_none()
    if not stock:
        return False

    try:
        db.query(StockEvent).filter(StockEvent.stock_id == stock_id).delete(synchronize_session=False)
        db.query(Scan).filter(Scan.stock_id == stock_id).delete(synchronize_session=False)
        db.query(InventoryStock).filter(InventoryStock.stock_id == stock_id).delete(synchronize_session=False)

        db.delete(stock)
        db.commit()
        return True
    except Exception:
        db.rollback()
        raise