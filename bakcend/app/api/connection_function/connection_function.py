import secrets

from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.orm import Session

#My imports
from app.database.connection import get_db
from app.database.models import User

from fastapi import Depends, HTTPException, Response

#crypt context for password hashing
import bcrypt

def hash_password(password: str) -> str:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt()).decode("utf-8")

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode("utf-8"), hashed.encode("utf-8"))

def _generate_random_token() -> str:
    return secrets.token_urlsafe(32)

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    message: str

def login(credentials: LoginRequest, response: Response, db: Session = Depends(get_db)):

    email = credentials.email.strip()
    

    if not email or not credentials.password:
        raise HTTPException(status_code=400, detail="il manque un champ")

    user = db.scalar(
        select(User).where(User.email == email)
    )

    if not user or not verify_password(credentials.password, user.password):
        print("Invalid credentials for email:", email,'or', credentials.password)
        raise HTTPException(status_code=401, detail="identifiants invalides")

    user.token = _generate_random_token()
    db.commit()

    response.set_cookie(
        key="token",
        value=user.token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 8  # 8 heures
    )

    return LoginResponse(
        message="Login successful"
    )
