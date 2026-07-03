from fastapi import APIRouter, Depends, Cookie, HTTPException
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.schemas import ProductScanResponse
from app.controllers.get_product_by_reference import get_product_by_reference

router = APIRouter()

@router.get("/scan", response_model=ProductScanResponse)
def scan_product_endpoint(
    reference: str,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db)
):
    """
    Endpoint pour récupérer un produit par sa référence via un scan.
    """
    return get_product_by_reference(reference, token, db)