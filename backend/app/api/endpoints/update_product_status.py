from fastapi import Depends, Cookie, APIRouter, HTTPException
from sqlalchemy.orm import Session

from app.schemas import ProductStatusUpdate
from app.database.connection import get_db
from app.controllers.update_product_status import update_product_status

router = APIRouter()

@router.patch("/{product_id}/status")
def update_product_status_endpoint(
    product_id: int,
    status_update: ProductStatusUpdate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    return update_product_status(product_id, status_update, token, db)