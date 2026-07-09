from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, is_user_center_admin_service, get_user_center_stocks_list_service
from app.schemas import OneStockFromInventory


def create_inventory_controller(token: str, db: Session) -> list[OneStockFromInventory]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    if not is_user_center_admin_service(user):
        raise HTTPException(status_code=403, detail="User is not the center admin")
    
    list_inventory_stocks = get_user_center_stocks_list_service(user, db)
    if not list_inventory_stocks:
        raise HTTPException(status_code=404, detail="No stocks found for the user's center")
    
    return list_inventory_stocks