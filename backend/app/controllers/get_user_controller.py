from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service
from app.schemas import UserProfile
from app.core.config import BASE_URL


def get_user_profile(token: str, db: Session) -> UserProfile:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    return UserProfile(
        id=user.id,
        name=user.name,
        lastname=user.lastname,
        email=user.email,
        telephone=user.telephone,
        street=user.street,
        city=user.city,
        postal_code=user.postal_code,
        status=user.status,
        created_at=user.created_at,
        updated_at=user.updated_at,
        photo_url=f"{BASE_URL}{user.photo_url}" if user.photo_url else None,
        center=user.center.name,
    )
