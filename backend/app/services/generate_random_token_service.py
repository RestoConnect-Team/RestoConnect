import secrets

from pytest import Session

from app.database.models import User

def generate_random_token_service(user : User, db : Session) -> str:
    token = secrets.token_urlsafe(32)
    user.token = token
    db.commit()
    return token