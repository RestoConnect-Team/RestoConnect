from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service, get_user_by_email_service
from app.services.create_user_service import create_user_service
from app.schemas import UserCreate, UserProfile
from app.database.models import User
from app.enums import UserStatus


def create_user_controller(
    payload: UserCreate, token: str | None, db: Session
) -> UserProfile:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    if user.status not in {UserStatus.SUPER_ADMIN, UserStatus.ADMIN}:
        raise HTTPException(
            status_code=403, detail="Seul un administrateur peut créer un compte"
        )

    if get_user_by_email_service(db, payload.email):
        raise HTTPException(status_code=400, detail="Cet email existe déjà")

    new_user = create_user_service(payload, db)

    return UserProfile(
        id=new_user.id,
        name=new_user.name,
        lastname=new_user.lastname,
        email=new_user.email,
        telephone=new_user.telephone,
        street=new_user.street,
        city=new_user.city,
        postal_code=new_user.postal_code,
        status=new_user.status,
        created_at=new_user.created_at,
        updated_at=new_user.updated_at,
        photo_url=None,
        center=new_user.center.name,
    )
