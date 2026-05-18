from fastapi import APIRouter, Depends, Response, Cookie
from sqlalchemy.orm import Session

from .connection_function import login, LoginRequest, LoginResponse
from .equipement_liste_function import get_user_equipement_liste_from_his_center
from app.database.connection import get_db

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login_endpoint(credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):
    return login(credentials, response, db)

@router.get("/stock_list", response_model=None)
def stock_list_endpoint(token: str = Cookie(default=None), db: Session = Depends(get_db)):
    return get_user_equipement_liste_from_his_center(token, db)