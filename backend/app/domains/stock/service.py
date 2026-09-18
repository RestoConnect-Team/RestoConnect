from sqlalchemy import select
from sqlalchemy.orm import Session, joinedload
from fastapi import HTTPException
from datetime import datetime


from app.database.models import Stock, Center, StockEvent, Scan, InventoryStock, User
from app.domains.stock.enums import StockEventType
from app.domains.stock.schemas import ProductDetailResponse, ProductDetail, ProductHistoryItem

def get_stocks_for_user_center(user: User, db: Session):
    equipement_list_query = select(Stock).where(Stock.center_id == user.center_id)

    return db.scalars(equipement_list_query).all()


def get_stocks_for_center(center: Center, db: Session) -> list[Stock]:
    stocks_query = select(Stock).where(Stock.center_id == center.id)

    return db.scalars(stocks_query).all()


def get_warehouse_stocks(db: Session):

    equipement_list_query = (
        select(Stock)
        .join(Center, Stock.center_id == Center.id)
        .where(Center.is_warehouse.is_(True))
    )

    return db.scalars(equipement_list_query).all()


def get_stock_by_reference(reference: str, db: Session):
    product = (
        db.query(Stock)
        .options(joinedload(Stock.center))
        .filter(Stock.reference == reference)
        .first()
    )

    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    return product


def get_stock_detail(product_id: int, db: Session) -> ProductDetailResponse:
    """
    Récupère les détails complets d'un produit, y compris son historique.
    """
    product = db.query(Stock).filter(Stock.id == product_id).one_or_none()

    if not product:
        return None

    # Récupérer l'historique
    history_query = db.query(StockEvent).filter(StockEvent.stock_id == product_id).order_by(StockEvent.event_date.desc()).all() # Utilise StockEvent

    history_items = []
    for item in history_query:
        user = db.query(User).filter(User.id == item.user_id).one_or_none()
        history_items.append(
            ProductHistoryItem(
                event_type=item.event_type.value,
                details=item.details,
                stock_date=item.event_date,
                user_name=f"{user.name} {user.lastname}" if user else "Système"
            )
        )

    # Construire l'objet de détails
    product_details = ProductDetail(
        id=product.id,
        name=product.name,
        reference=product.reference,
        status=product.status,
        category=product.category,
        center_name=product.center.name if product.center else "N/A",
        added_date=product.creation_date,
        description=product.description,
        rating=product.rating
    )

    return ProductDetailResponse(
        details=product_details,
        history=history_items
    )


def update_stock_status(product_id: int, status: str, db: Session):
    product = db.query(Stock).filter(Stock.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Produit non trouvé")

    product.status = status
    db.commit()
    db.refresh(product)

    return product


def delete_stock(stock_id: int, db: Session) -> bool:
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

def add_stock_event(
    db: Session,
    stock_id: int,
    event_type: StockEventType,
    user_id: int | None = None,
    details: str | None = None,
):
    """
    Enregistre un nouvel événement pour un article et met à jour la date du dernier scan.
    """
    # 1. Mettre à jour la date du dernier scan sur l'article
    stock_item = db.query(Stock).filter(Stock.id == stock_id).one()
    stock_item.last_scan_date = datetime.utcnow().date()

    # 2. Créer le nouvel événement
    new_event = StockEvent(stock_id=stock_id, user_id=user_id, event_type=event_type, details=details)
    db.add(new_event)
    
    # La session sera commitée par le controller qui appelle ce service.
    return new_event