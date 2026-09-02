from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service
from app.services.create_stock_service import create_stock_service
from app.schemas import StockCreate, OneEquipementFromList


def create_stock_controller(
    payload: StockCreate, token: str | None, db: Session
) -> OneEquipementFromList:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    stock = create_stock_service(payload, user.center_id, db)

    return OneEquipementFromList(
        id=stock.id,
        name=stock.name,
        reference=stock.reference,
        category=stock.category,
        status=stock.status,
        qr_code=stock.qr_code,
        center_name=stock.center.name,
    )
