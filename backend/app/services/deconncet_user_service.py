from sqlalchemy.orm import Session

from app.database.models import User


def deconnect_user_service(db: Session, user: User) -> bool :
    user.token = None
    db.commit()
    return True
