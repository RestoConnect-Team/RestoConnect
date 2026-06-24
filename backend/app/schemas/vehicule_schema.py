from typing import Optional

from pydantic import BaseModel


class VehiculeSchema(BaseModel):
    id: int
    name: str
    location: Optional[str] = None
    center_name: Optional[str] = None
    responsable_name: Optional[str] = None
    responsable_email: Optional[str] = None
    has_documents: bool

    class Config:
        from_attributes = True


class VehiculeListGrouped(BaseModel):
    vehicules_center: list[VehiculeSchema]
    vehicules_other: list[VehiculeSchema]