from fastapi import HTTPException
from sqlalchemy.orm import Session

from app.services import delete_center_service


def delete_center_controller(center_id: int, db: Session) -> bool:
    if not delete_center_service(center_id, db):
        raise HTTPException(status_code=404, detail="Center not found")
    return delete_center_service(center_id, db)