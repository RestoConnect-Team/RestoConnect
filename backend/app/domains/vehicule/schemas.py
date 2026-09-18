import datetime
from typing import Optional, List

from pydantic import BaseModel

from app.domains.vehicule.enums import VehiculeAlertLevel


class OneVehiculeFromList(BaseModel):
    id: int
    name: str
    immatriculation: Optional[str] = None
    center_name: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None

    class Config:
        from_attributes = True


class VehiculeListGrouped(BaseModel):
    vehicules_center: list[OneVehiculeFromList]
    vehicules_other: list[OneVehiculeFromList]


class VehiculeAlert(BaseModel):

    level: VehiculeAlertLevel

    name: str
    description: Optional[str] = None
    expire_date: datetime.date
    expired_since: Optional[int] = None
    will_expire_in: Optional[int] = None


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


class VehiculeDocumentInfos(BaseModel):
    id: int
    file_name: str
    description: Optional[str] = None
    upload_date: Optional[datetime.date] = None
    file_date: Optional[datetime.date] = None
    expiration_date: Optional[datetime.date] = None
    file_url: Optional[str] = None


class VehiculeDetailResponse(BaseModel):
    vehicule: VehiculeInfos
    documents: List[VehiculeDocumentInfos]
    document_alertes: List[VehiculeAlert]
    technical_inspection_alerte: Optional[VehiculeAlert] = None