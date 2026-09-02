from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import delete_stock_service, get_user_by_token_service
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


def delete_stock_controller(stock_id: int, token: str | None, db: Session) -> bool:
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

    deleted = delete_stock_service(stock_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Stock not found")
    return True
