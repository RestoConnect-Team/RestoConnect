import secrets

from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.database.models import User

from fastapi import Depends, HTTPException

def _generate_random_token() -> str:
    return secrets.token_urlsafe(32)

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    token: str | None = None

def login(credentials: LoginRequest, db: Session = Depends(get_db)):
    """
    Simple login endpoint. 
    TODO: Add proper password hashing and JWT tokens
    """
    email = credentials.email.strip()

    if not email or not credentials.password:
        raise HTTPException(status_code=400, detail="Email and password required")

    user_id = db.execute(
        select(User.id).where(
            User.email == email,
            User.password == credentials.password,
        )
    ).scalar_one_or_none()

    if user_id is not None:
        return LoginResponse(
            success=True,
            message="Login successful",
            token=_generate_random_token()
        )

    raise HTTPException(status_code=401, detail="Invalid credentials")
