from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import delete_stock_service


def delete_stock_controller(stock_id: int, db: Session) -> bool:
    deleted = delete_stock_service(stock_id, db)
    if not deleted:
        raise HTTPException(status_code=404, detail="Stock not found")
    return True