from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.get_stock_detail_service import get_stock_detail_service
from app.services.get_user_service import get_user_by_token_service
from app.schemas.product_detail_schema import ProductDetailResponse
from app.database.models import Stock, Center


def _user_can_access_center(user, db: Session, center_id: int) -> bool:
    if center_id == user.center_id:
        return True
    warehouse = (
        db.query(Center)
        .filter(Center.id == center_id, Center.is_warehouse.is_(True))
        .first()
    )
    return warehouse is not None


def get_stock_detail_controller(
    product_id: int, token: str | None, db: Session
) -> ProductDetailResponse:
    """
    Contrôleur pour récupérer les détails d'un produit.
    Gère l'authentification et les cas où le produit n'est pas trouvé.
    """
    if not token:
        raise HTTPException(status_code=401, detail="Non authentifié")
    current_user = get_user_by_token_service(db, token)
    if not current_user:
        raise HTTPException(status_code=401, detail="Jeton invalide")

    stock = db.query(Stock).filter(Stock.id == product_id).one_or_none()
    if not stock:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    if not _user_can_access_center(current_user, db, stock.center_id):
        raise HTTPException(status_code=403, detail="Accès refusé à ce matériel")

    product_detail = get_stock_detail_service(product_id, db)
    if not product_detail:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return product_detail
