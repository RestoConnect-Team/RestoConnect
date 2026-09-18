from sqlalchemy.orm import Session
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import User
import secrets

import bcrypt


def deconnect_user_service(db: Session, user: User) -> bool :
    user.token = None
    db.commit()
    return True

def hash_password_service(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password_service(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def get_user_by_email_service(db: Session, email: str) -> User | None:

    return db.scalar(
        select(User).where(User.email == email)
    )

def generate_random_token_service(user : User, db : Session) -> str:
    token = secrets.token_urlsafe(32)
    user.token = token
    db.commit()
    return token