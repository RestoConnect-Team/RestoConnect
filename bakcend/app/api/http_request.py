import os

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from sqlalchemy import create_engine, text
from sqlalchemy.exc import SQLAlchemyError

router = APIRouter()
DATABASE_URL = os.getenv("DATABASE_URL")
engine = create_engine(DATABASE_URL) if DATABASE_URL else None

class LoginRequest(BaseModel):
    email: str
    password: str

class LoginResponse(BaseModel):
    success: bool
    message: str
    token: str | None = None

@router.post("/login")
def login(credentials: LoginRequest):
    """
    Simple login endpoint. 
    TODO: Add proper password hashing and JWT tokens
    """
    # Placeholder logic - replace with real authentication
    if not credentials.email or not credentials.password:
        raise HTTPException(status_code=400, detail="Email and password required")

    if engine is None:
        raise HTTPException(status_code=500, detail="Database not configured")

    try:
        with engine.connect() as connection:
            user_exists = connection.execute(
                text(
                    """
                    SELECT 1
                    FROM users
                    WHERE email = :email AND password = :password
                    LIMIT 1
                    """
                ),
                {"email": credentials.email, "password": credentials.password},
            ).scalar_one_or_none()
    except SQLAlchemyError as exc:
        raise HTTPException(status_code=500, detail="Database validation failed") from exc

    if user_exists:
        return LoginResponse(
            success=True,
            message="Login successful",
            token="dummy_token_123"  # TODO: Generate real JWT token
        )

    raise HTTPException(status_code=401, detail="Invalid credentials")

