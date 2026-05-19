from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from pydantic import BaseModel
from typing import Optional

from app.database.models import User

class Profil(BaseModel):
    id : int
    name : Optional[str] = None
    lastname: Optional[str] = None
    email : Optional[str] = None
    telephone : Optional[str] = None
    #adresse
    street : Optional[str] = None
    city : Optional[str] = None
    postal_code : Optional[str] = None
    #status
    status :  Optional[str] = None
    # creation date
    created_at : Optional[str] = None
    # update date
    updated_at : Optional[str] = None

    # photo url
    photo_url : Optional[str] = None
    # infos du centre
    center : Optional[str] = None



def get_user_profil(token: str, db: Session):
    user = db.scalar(
        select(User).where(User.token == token)
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    user_center = user.center

    profil = Profil(
        id=user.id,
        name=user.name,
        lastname=user.lastname,
        email=user.email,
        telephone=user.telephone,
        street=user.street,
        city=user.city,
        postal_code=user.postal_code,
        status=user.status,
        created_at=user.created_at,
        updated_at=user.updated_at,
        photo_url = f"http://localhost:8000{user.photo_url}" if user.photo_url else None,
        center=user_center.name
    )

    return(profil)
