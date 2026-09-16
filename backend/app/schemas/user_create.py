from typing import Optional

from pydantic import BaseModel

from app.enums import UserStatus


class UserCreate(BaseModel):
    name: str
    lastname: str
    email: str
    password: str
    status: UserStatus
    center_id: int
    telephone: Optional[str] = None
    street: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
