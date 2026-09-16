from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas import ProductStatusUpdate
from app.services.get_user_service import get_user_by_token_service
from app.services.update_stock_status_service import update_stock_status_service
from app.database.models import Stock


def _stock_belongs_to_user_center(stock: Stock, user_center_id: int) -> bool:
    return stock.center_id == user_center_id


def update_stock_status(
    product_id: int, status_update: ProductStatusUpdate, token: str, db: Session
):
    """Met à jour le statut d'un produit, restreint au centre de l'utilisateur."""
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    current_user = get_user_by_token_service(db, token)
    if not current_user:
        raise HTTPException(status_code=401, detail="Invalid token")

    stock = db.query(Stock).filter(Stock.id == product_id).first()
    if not stock:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    if not _stock_belongs_to_user_center(stock, current_user.center_id):
        raise HTTPException(status_code=403, detail="Accès refusé à ce matériel")

    product = update_stock_status_service(product_id, status_update.status, db)
    return {
        "message": f"Statut du produit {product.name} mis à jour à '{status_update.status}'."
    }
