from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from .connection_fonction import login, LoginRequest, LoginResponse
from app.database.connection import get_db

router = APIRouter()

@router.post("/login", response_model=LoginResponse)
def login_endpoint(credentials: LoginRequest, db: Session = Depends(get_db)):
    return login(credentials, db)

@router.post("/stock_list", response_model=list)
def stock_list_endpoint(db: Session = Depends(get_db)):
    # Implementation for stock list endpoint
    pass