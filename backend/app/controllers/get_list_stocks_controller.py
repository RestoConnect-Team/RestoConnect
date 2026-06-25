from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token, get_list_stocks_service
from app.schemas import OneEquipementFromList


def get_list_vehicules(token: str, db: Session) -> list[OneEquipementFromList]:
    user = get_user_by_token(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    results = get_list_stocks_service(user, db)

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