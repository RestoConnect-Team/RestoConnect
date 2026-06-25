from typing import Optional

from pydantic import BaseModel


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