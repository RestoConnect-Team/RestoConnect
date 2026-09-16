from datetime import date

from sqlalchemy.orm import Session

from app.database.models import User
from app.schemas import UserCreate
from app.services.hash_password_service import hash_password_service


def create_user_service(payload: UserCreate, db: Session) -> User:
    user = User(
        name=payload.name,
        lastname=payload.lastname,
        email=payload.email,
        password=hash_password_service(payload.password),
        status=payload.status,
        center_id=payload.center_id,
        telephone=payload.telephone,
        street=payload.street,
        city=payload.city,
        postal_code=payload.postal_code,
        created_at=date.today(),
        updated_at=date.today(),
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return user
