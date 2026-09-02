from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import delete_center_service, get_user_by_token_service
from app.database.models import Center
from app.enums import UserStatus


def delete_center_controller(center_id: int, token: str | None, db: Session) -> bool:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    center = db.query(Center).filter(Center.id == center_id).one_or_none()
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")

    is_global_admin = user.status in (UserStatus.SUPER_ADMIN, UserStatus.ADMIN)
    if not is_global_admin and center.id != user.center_id:
        raise HTTPException(status_code=403, detail="Accès refusé à ce centre")

    if not delete_center_service(center_id, db):
        raise HTTPException(status_code=404, detail="Center not found")
    return True
