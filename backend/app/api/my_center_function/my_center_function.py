from ast import stmt

from typing import Optional

from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.models import User, Center

class People(BaseModel):
    id : int
    name : str
    email : str
    telephone : str

class MyCenter(BaseModel):
    id : int
    name : str
    location : Optional[str]
    alerte : Optional[str]
    schedule : Optional[str]
    responsable_name : str
    responsable_email : str
    responsable_number : str
    #liste_of_people : Optional[list[People]]

def get_my_center_info(token: str, db: Session):
    user = db.scalar(
        select(User).where(User.token == token)
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    center = db.scalar(
        select(Center).where(Center.id == user.center_id)
    )
    if not center:
        raise HTTPException(status_code=404, detail="Center not found")

    responsable = db.scalar(
        select(User).where(
            User.center_id == center.id,
            User.status == "responsable de centre"
        )
    )
  
    myCenter= MyCenter(
        id=center.id,
        name=center.name,
        location=center.location,
        alerte=center.alerte,
        schedule=center.schedule, 
        responsable_name=responsable.name,
        responsable_email=responsable.email,
        responsable_number=responsable.telephone
        )
        
    return myCenter