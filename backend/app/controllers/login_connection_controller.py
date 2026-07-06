from sqlalchemy.orm import Session
from fastapi import Depends, HTTPException, Response

from app.schemas import LoginRequest, LoginResponse

from app.services import verify_password_service, generate_random_token_service, get_user_by_email_service

def login_connection_controller(credentials: LoginRequest, response: Response, db: Session):

    email = credentials.email.strip()
    

    if not email or not credentials.password:
        raise HTTPException(status_code=400, detail="il manque un champ")

    user = get_user_by_email_service(db, email)

    if not user or not verify_password_service(credentials.password, user.password):
        print("Invalid credentials for email:", email,'or', credentials.password)
        raise HTTPException(status_code=401, detail="identifiants invalides")

    token = generate_random_token_service(user, db)
    

    response.set_cookie(
        key="token",
        value=token,
        httponly=True,
        samesite="lax",
        max_age=60 * 60 * 8  # 8 heures
    )

    return LoginResponse(
        message="Login successful"
    )
