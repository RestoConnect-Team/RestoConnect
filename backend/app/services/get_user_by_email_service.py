from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import User

def get_user_by_email_service(db: Session, email: str) -> User | None:

    return db.scalar(
        select(User).where(User.email == email)
    )