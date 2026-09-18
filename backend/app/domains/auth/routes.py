from fastapi import APIRouter, Depends, Cookie, Response
from sqlalchemy.orm import Session

from app.domains.auth.controller import deconnect_user_controller, login_connection_controller
from app.domains.auth.schemas import LoginRequest, LoginResponse

from app.database.connection import get_db

router = APIRouter()

@router.post("/deconnection", response_model=bool)
def deconnection_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return deconnect_user_controller(token, db)

@router.post("/login", response_model=LoginResponse)
def login_endpoint(credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):
    return login_connection_controller(credentials, response, db)



