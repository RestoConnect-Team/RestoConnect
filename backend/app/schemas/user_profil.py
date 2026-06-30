from datetime import datetime
from typing import Optional

from pydantic import BaseModel


class UserProfile(BaseModel):
    id: int
    name: str
    lastname: str
    email: str
    street_number : Optional[int] = None
    telephone: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    status: str
    created_at: datetime
    updated_at: datetime
    photo_url: Optional[str] = None
    center: str

    class Config:
        from_attributes = True  # permet de valider depuis un objet ORM