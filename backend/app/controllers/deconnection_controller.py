from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, deconnect_user_service


def deconnect_user_controller(token: str, db: Session) -> bool:
    user = get_user_by_token_service(db, token)

    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return deconnect_user_service(db, user)