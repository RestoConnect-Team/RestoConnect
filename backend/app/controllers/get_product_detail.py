from fastapi import HTTPException
from sqlalchemy.orm import Session
from app.services.get_product_detail_service import get_product_detail_service
from app.services.get_user_service import get_user_by_token_service
from app.schemas.product_detail_schema import ProductDetailResponse

def get_product_detail_controller(
    product_id: int,
    token: str | None,
    db: Session
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

    product_detail = get_product_detail_service(product_id, db)
    if not product_detail:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return product_detail