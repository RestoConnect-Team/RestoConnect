from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service
from app.services.update_stock_service import update_stock_service
from app.schemas import StockUpdate, OneEquipementFromList
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


def update_stock_controller(
    stock_id: int, payload: StockUpdate, token: str | None, db: Session
) -> OneEquipementFromList:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    stock = db.query(Stock).filter(Stock.id == stock_id).one_or_none()
    if not stock:
        raise HTTPException(status_code=404, detail="Stock not found")
    if not _user_can_access_center(user, db, stock.center_id):
        raise HTTPException(status_code=403, detail="Accès refusé à ce matériel")

    updated = update_stock_service(stock_id, payload, db)
    if not updated:
        raise HTTPException(status_code=404, detail="Stock not found")

    return OneEquipementFromList(
        id=updated.id,
        name=updated.name,
        reference=updated.reference,
        category=updated.category,
        status=updated.status,
        qr_code=updated.qr_code,
        center_name=updated.center.name,
    )
