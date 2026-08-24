from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, get_center_service, get_center_stocks_list_service
from app.schemas import OneEquipementFromList


def get_center_stocks_controller(center_id: int, token: str, db: Session) -> list[OneEquipementFromList]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    center = get_center_service(center_id, db)
    if not center:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")

    stocks = get_center_stocks_list_service(center, db)

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