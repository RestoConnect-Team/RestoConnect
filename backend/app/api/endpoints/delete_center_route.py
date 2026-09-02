from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers import delete_center_controller

from app.database.connection import get_db


router = APIRouter()


@router.delete("/{center_id}", response_model=bool)
def delete_center_endpoint(
    center_id: int,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return delete_center_controller(center_id, token, db)
