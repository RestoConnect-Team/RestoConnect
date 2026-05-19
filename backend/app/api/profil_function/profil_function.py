from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.models import User

class Profil(BaseModel):
    id : int
    name : str
    lastname: str
    email : str
    telephone : str
    #adresse
    street : str
    city : str
    postal_code : str
    #status
    status : str
    # creation date
    created_at : str
    # update date
    updated_at : str

    # photo url
    photo_url : str
    # infos du centre
    center : str 



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
        created_at=user.created_at.isoformat(),
        updated_at=user.updated_at.isoformat(),
        photo_url = f"http://localhost:8000{user.photo_url}" if user.photo_url else None,
        center=user_center.name
    )

    return(profil)
