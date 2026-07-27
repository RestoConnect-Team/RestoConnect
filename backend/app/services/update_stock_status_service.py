from sqlalchemy.orm import Session
from fastapi import HTTPException

from app.database.models import Stock


def update_stock_status_service(product_id: int, status: str, db: Session):
    product = db.query(Stock).filter(Stock.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    product.status = status
    db.commit()
    db.refresh(product)

    return product