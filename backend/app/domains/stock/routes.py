from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.domains.stock.controller import (
    get_list_stocks,
    get_center_stocks,
    get_stock_by_reference,
    get_stock_detail,
    update_stock_status,
    delete_stock,
)
from app.domains.stock.schemas import OneEquipementFromList, ProductScanResponse, ProductStatusUpdate, ProductDetailResponse

router = APIRouter()


@router.get("/stock_list", response_model=list[OneEquipementFromList])
def list_stocks_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_list_stocks(token, db)


@router.get("/stock/scan", response_model=ProductScanResponse)
def scan_stock_endpoint(
    reference: str,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    """
    Endpoint pour récupérer un produit par sa référence via un scan.
    """
    return get_stock_by_reference(reference, token, db)


@router.get("/stock/{product_id}", response_model=ProductDetailResponse)
def get_stock_detail_endpoint(
    product_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    return get_stock_detail(product_id, token, db)


@router.patch("/stock/{product_id}/status")
def update_stock_status_endpoint(
    product_id: int,
    status_update: ProductStatusUpdate,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    return update_stock_status(product_id, status_update, token, db)


@router.delete("/stock/{stock_id}", response_model=bool)
def delete_stock_endpoint(
    stock_id: int,
    db: Session = Depends(get_db)
):
    return delete_stock(stock_id, db)


@router.get("/center/{center_id}/stocks", response_model=list[OneEquipementFromList])
def center_stocks_endpoint(center_id: int, token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_center_stocks(center_id, token, db)