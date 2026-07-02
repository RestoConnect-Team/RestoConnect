from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from app.database.models import Stock


def get_product_by_reference_service(reference: str, db: Session):
    product = (
        db.query(Stock)
        .options(joinedload(Stock.center))
        .filter(Stock.reference == reference)
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    return product