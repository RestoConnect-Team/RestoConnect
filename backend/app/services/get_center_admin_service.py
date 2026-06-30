from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Center, User

from app.enums import UserStatus

def get_center_admin_service(center: Center, db: Session) -> User | None:
    stmt = select(User).where(
        (User.center_id == center.id) & (User.status == UserStatus.CENTER_ADMIN)
    )

    return db.scalar(stmt)