
from typing import List, Optional
from pydantic import BaseModel

from app.enums import CenterStatus
from app.schemas import WeeklySchedule, OneEquipementFromList


class WarehouseInfos(BaseModel):
    center_id: int
    name: str
    # adresse
    street_number: Optional[int] = None
    street: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    # status Ouvert / fermer / arrêt saisonier
    status: CenterStatus

    description: Optional[str] = None
    activities: Optional[str] = None

    center_headmaster_name: str
    center_headmaster_lastname: str
    center_headmaster_email: str
    center_headmaster_telephone: str

    center_schedule: WeeklySchedule

    # Specification of the warehouse
    stocks_list: List[OneEquipementFromList]