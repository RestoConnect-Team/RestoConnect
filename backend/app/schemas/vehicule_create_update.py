from typing import Optional

from pydantic import BaseModel

from app.enums import VehiculeCategory, VehiculeStatus


class VehiculeCreate(BaseModel):
    name: str
    immatriculation: str
    category: VehiculeCategory
    status: VehiculeStatus
    nb_km: Optional[int] = 0


class VehiculeUpdate(BaseModel):
    name: Optional[str] = None
    immatriculation: Optional[str] = None
    category: Optional[VehiculeCategory] = None
    status: Optional[VehiculeStatus] = None
    nb_km: Optional[int] = None
