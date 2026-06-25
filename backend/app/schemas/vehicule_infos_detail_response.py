from typing import List, Optional

from app.schemas import VehiculeAlert, VehiculeInfos
from pydantic import BaseModel


class VehiculeDetailResponse(BaseModel):
    vehicule: VehiculeInfos
    document_alertes: List[VehiculeAlert]
    technical_inspection_alerte: Optional[VehiculeAlert] = None