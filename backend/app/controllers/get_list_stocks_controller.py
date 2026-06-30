from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, get_user_center_stocks_list_service
from app.schemas import OneEquipementFromList


def get_list_vehicules(token: str, db: Session) -> list[OneEquipementFromList]:
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    results = get_user_center_stocks_list_service(user, db)

    response = []
    for equipement in results:
        response.append( OneEquipementFromList(
            id=equipement.id,
            name=equipement.name,
            reference=equipement.reference,
            category=equipement.category,
            status=equipement.status,
            qr_code=equipement.qr_code
            )
        )


    return response