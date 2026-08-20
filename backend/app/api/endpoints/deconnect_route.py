from fastapi import APIRouter, Depends, Cookie, Response
from sqlalchemy.orm import Session

from app.controllers import deconnect_user_controller


from app.database.connection import get_db

router = APIRouter()


@router.get("/deconnection", response_model=bool)
def deconnection_endpoint(
    token: str = Cookie(default=None),
    response: Response = None,  # type: ignore[assignment]
    db: Session = Depends(get_db),
):
    result = deconnect_user_controller(token, db)
    response.delete_cookie(key="token")
    return result
