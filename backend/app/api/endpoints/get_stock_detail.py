from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas.product_detail_schema import ProductDetailResponse
from app.controllers.get_stock_detail import get_stock_detail_controller

router = APIRouter()

@router.get("/{product_id}", response_model=ProductDetailResponse)
def get_stock_detail_endpoint(
    product_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    return  get_stock_detail_controller(product_id, token, db)