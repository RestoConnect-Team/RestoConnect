from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import User


def get_user_by_token_service(db: Session, token: str) -> User | None:
    return db.scalar(select(User).where(User.token == token))