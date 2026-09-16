from fastapi import HTTPException
from fastapi.responses import StreamingResponse
from sqlalchemy.orm import Session

from app.services import get_user_by_token_service
from app.services.export_centers_service import export_centers_service
from app.schemas import CenterExportRequest
from app.enums import UserStatus


def export_centers_controller(
    payload: CenterExportRequest, token: str | None, db: Session
) -> StreamingResponse:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    if user.status not in {UserStatus.SUPER_ADMIN, UserStatus.ADMIN}:
        raise HTTPException(
            status_code=403, detail="Seul un administrateur peut exporter"
        )

    if not payload.center_ids:
        raise HTTPException(status_code=400, detail="Aucun centre sélectionné")

    csv_content = export_centers_service(payload.center_ids, db)

    return StreamingResponse(
        iter([csv_content]),
        media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="centres.csv"'},
    )
