from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.domains.stock import service
from app.domains.center.service import get_center_service
from app.services.get_user_service import get_user_by_token_service
from app.domains.stock.schemas import OneEquipementFromList, ProductScanResponse, ProductStatusUpdate, ProductDetailResponse


def get_list_stocks(token: str, db: Session) -> list[OneEquipementFromList]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    results = service.get_stocks_for_user_center(user, db)

    response = []
    for equipement in results:
        response.append( OneEquipementFromList(
            id=equipement.id,
            name=equipement.name,
            reference=equipement.reference,
            category=equipement.category,
            status=equipement.status,
            qr_code=equipement.qr_code,
            center_name=equipement.center.name
            )
        )

    results_warehouse = service.get_warehouse_stocks(db)
    for equipement in results_warehouse:
        response.append( OneEquipementFromList(
            id=equipement.id,
            name=equipement.name,
            reference=equipement.reference,
            category=equipement.category,
            status=equipement.status,
            qr_code=equipement.qr_code,
            center_name=equipement.center.name
            )
        )

    return response


def get_center_stocks(center_id: int, token: str, db: Session) -> list[OneEquipementFromList]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    center = get_center_service(center_id, db)
    if not center:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")

    stocks = service.get_stocks_for_center(center, db)

    return [
        OneEquipementFromList(
            id=stock.id,
            name=stock.name,
            reference=stock.reference,
            category=stock.category,
            status=stock.status,
            qr_code=stock.qr_code,
            center_name=center.name,
        )
        for stock in stocks
    ]


def get_stock_by_reference(
    reference: str,
    token: str,
    db: Session
):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    product = service.get_stock_by_reference(reference, db)

    return ProductScanResponse(
        id=product.id,
        name=product.name,
        reference=product.reference,
        status=product.status,
        center_name=product.center.name
    )


def get_stock_detail(
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

    product_detail = service.get_stock_detail(product_id, db)
    if not product_detail:
        raise HTTPException(status_code=404, detail="Produit non trouvé")
    return product_detail


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

    product = service.update_stock_status(product_id, status_update.status, db)
    return {"message": f"Statut du produit {product.name} mis à jour à '{status_update.status}'."}


def delete_stock(stock_id: int, db: Session) -> bool:
    deleted = service.delete_stock(stock_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Stock not found")
    return True
