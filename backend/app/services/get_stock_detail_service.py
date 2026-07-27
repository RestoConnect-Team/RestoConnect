from sqlalchemy.orm import Session
from app.database.models import Stock, User, StockEvent
from app.schemas.product_detail_schema import ProductDetailResponse, ProductDetail, ProductHistoryItem
from app.core.config import BASE_URL

def get_stock_detail_service(product_id: int, db: Session) -> ProductDetailResponse:
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