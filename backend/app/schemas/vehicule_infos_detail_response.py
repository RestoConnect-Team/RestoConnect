from typing import List, Optional

from app.schemas import VehiculeAlert, VehiculeInfos, VehiculeDocumentInfos
from pydantic import BaseModel


class VehiculeDetailResponse(BaseModel):
    vehicule: VehiculeInfos
    documents: List[VehiculeDocumentInfos]
    document_alertes: List[VehiculeAlert]
    technical_inspection_alerte: Optional[VehiculeAlert] = None