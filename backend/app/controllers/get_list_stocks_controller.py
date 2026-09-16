from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import (
    get_user_by_token_service,
    get_list_stocks_user_center_service,
    get_list_stocks_warehouse_service,
)
from app.schemas import OneEquipementFromList


def get_list_stocks_controller(token: str, db: Session) -> list[OneEquipementFromList]:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    results = get_list_stocks_user_center_service(user, db)

    response = []
    for equipement in results:
        response.append(
            OneEquipementFromList(
                id=equipement.id,
                name=equipement.name,
                reference=equipement.reference,
                category=equipement.category,
                status=equipement.status,
                qr_code=equipement.qr_code,
                center_name=equipement.center.name,
            )
        )

    results_warehouse = get_list_stocks_warehouse_service(db)
    for equipement in results_warehouse:
        response.append(
            OneEquipementFromList(
                id=equipement.id,
                name=equipement.name,
                reference=equipement.reference,
                category=equipement.category,
                status=equipement.status,
                qr_code=equipement.qr_code,
                center_name=equipement.center.name,
            )
        )

    return response
