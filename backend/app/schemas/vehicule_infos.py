from typing import Optional
import datetime
from pydantic import BaseModel

class VehiculeInfos(BaseModel):
    id: int
    name: str
    immatriculation: str
    category: str
    status: str
    nb_km: int
    last_technical_inspection_date: Optional[datetime.date] = None
    next_technical_inspection_date: Optional[datetime.date] = None
    last_service_date: Optional[datetime.date] = None
    next_service_date: Optional[datetime.date] = None

    center_name : str

    responsable_name: Optional[str] = None
    responsable_lastname: Optional[str] = None
    responsable_email: Optional[str] = None
    responsable_phone: Optional[str] = None

