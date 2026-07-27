from sqlalchemy.orm import Session
from app.database.models import Stock

def delete_stock_service(stock_id: int, db: Session) -> bool:
    stock = db.query(Stock).filter(Stock.id == stock_id).one_or_none()
    if not stock:
        return False

    db.delete(stock)
    db.commit()
    
    return True