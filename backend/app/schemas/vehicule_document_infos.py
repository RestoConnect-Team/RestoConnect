from typing import Optional
import datetime
from pydantic import BaseModel


class VehiculeDocumentInfos(BaseModel):
    id: int
    file_name: str
    description: Optional[str] = None
    upload_date: Optional[datetime.date] = None
    file_date: Optional[datetime.date] = None
    expiration_date: Optional[datetime.date] = None
    file_url: Optional[str] = None
