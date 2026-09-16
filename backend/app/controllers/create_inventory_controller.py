from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_user_by_token_service,
    is_user_center_admin_service,
    create_inventory_service,
)
from app.schemas import OneStockFromInventory


def create_inventory_controller(token: str, db: Session) -> list[OneStockFromInventory]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not is_user_center_admin_service(user):
        raise HTTPException(status_code=403, detail="User is not the center admin")

    return create_inventory_service(user, db)
