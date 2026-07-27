from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas import ProductStatusUpdate
from app.services.get_user_service import get_user_by_token_service
from app.services.update_stock_status_service import update_stock_status_service


def update_stock_status(
    product_id: int,
    status_update: ProductStatusUpdate,
    token: str,
    db: Session
):
    """
    Met à jour le statut d'un produit.
    """
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    current_user = get_user_by_token_service(db, token)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")

    product = update_stock_status_service(product_id, status_update.status, db)
    return {"message": f"Statut du produit {product.name} mis à jour à '{status_update.status}'."}