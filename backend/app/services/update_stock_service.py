from sqlalchemy.orm import Session

from app.database.models import Stock


def update_stock_service(stock_id: int, payload, db: Session) -> Stock | None:
    stock = db.query(Stock).filter(Stock.id == stock_id).one_or_none()
    if not stock:
        return None

    if payload.name is not None:
        stock.name = payload.name
    if payload.category is not None:
        stock.category = payload.category
    if payload.reference is not None:
        stock.reference = payload.reference
        stock.qr_code = payload.reference
    if payload.description is not None:
        stock.description = payload.description

    db.commit()
    db.refresh(stock)
    return stock
