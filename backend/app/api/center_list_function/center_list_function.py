from ast import stmt

from typing import Optional

from fastapi import HTTPException

from sqlalchemy import select
from sqlalchemy.orm import Session

from pydantic import BaseModel

from app.database.models import User, Center

class CenterResponse(BaseModel):
    id: int
    name : str
    location : Optional[str]
    alerte : Optional[str]
    schedule : Optional[str]
    responsable_name : str
    responsable_email : str
    responsable_number : str

def get_list_centers(token: str, db: Session):
    user = db.scalar(
        select(User).where(User.token == token)
    )
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    
    query_center = (select(Center, User).join(User, User.center_id == Center.id).where(User.status == "responsable de centre"))

    centers = db.execute(query_center).all()
    print(centers)
    centersList = []

    for center, responsable in centers:
        center_data = CenterResponse(
            id=center.id,
            name=center.name,
            location=center.location,
            alerte=center.alerte,
            schedule=center.schedule, 
            responsable_name=responsable.name,
            responsable_email=responsable.email,
            responsable_number=responsable.telephone
        )
        centersList.append(center_data)
    
    print(centersList)
        
    return centersList
