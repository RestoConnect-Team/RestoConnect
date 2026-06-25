from typing import Optional
import datetime
from pydantic import BaseModel

from app.enums import VehiculeAlertLevel

class VehiculeAlert(BaseModel):
    
    level: VehiculeAlertLevel

    name: str
    description: Optional[str] = None
    expire_date: datetime.date
    expired_since: Optional[int] = None
    will_expire_in: Optional[int] = None

