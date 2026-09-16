from fastapi import APIRouter, Depends, Cookie
from sqlalchemy.orm import Session

from app.controllers.export_centers_controller import export_centers_controller
from app.schemas import CenterExportRequest
from app.database.connection import get_db

router = APIRouter()


@router.post("/export")
def export_centers_endpoint(
    payload: CenterExportRequest,
    token: str | None = Cookie(default=None),
    db: Session = Depends(get_db),
):
    return export_centers_controller(payload, token, db)
