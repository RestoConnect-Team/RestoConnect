from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session

from .connection_function import login, LoginRequest, LoginResponse
from app.database.connection import get_db

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login_endpoint(credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):
    return login(credentials, response, db)

@router.post("/stock_list", response_model=list)
def stock_list_endpoint(db: Session = Depends(get_db)):
    # Implementation for stock list endpoint
    pass