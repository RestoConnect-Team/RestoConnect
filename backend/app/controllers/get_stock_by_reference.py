from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.schemas import ProductScanResponse
from app.services.get_stock_by_reference_service import get_stock_by_reference_service
from app.services.get_user_service import get_user_by_token_service
from app.database.models import User
def get_stock_by_reference(
    reference: str,
    token: str,
    db: Session
):
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user: User | None = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    product = get_stock_by_reference_service(reference, db)

    return ProductScanResponse(
        id=product.id,
        name=product.name,
        reference=product.reference,
        status=product.status,
        center_name=product.center.name
    )