from datetime import date
from pydantic import BaseModel
from typing import Optional, List

from app.enums import CenterStatus
from app.schemas import WeeklySchedule


class ContactInfo(BaseModel):
    id: int
    name: str
    lastname: str
    email: Optional[str] = None
    telephone: Optional[str] = None
    status: str
    photo_url: Optional[str] = None


class CenterAlert(BaseModel):
    alert_type: str
    message: str
    time_ago: str


class ClosingPeriodSchema(BaseModel):
    id: Optional[int] = None
    start_date: date
    end_date: date


class CenterInfos(BaseModel):
    center_id: int
    name: str
    # address
    street_number: Optional[int] = None
    street: Optional[str] = None
    city: Optional[str] = None
    postal_code: Optional[str] = None
    # center contact
    telephone: Optional[str] = None
    email: Optional[str] = None
    # status
    status: CenterStatus

    description: Optional[str] = None
    activities: Optional[str] = None

    center_headmaster_name: str
    center_headmaster_lastname: str
    center_headmaster_email: str
    center_headmaster_telephone: str

    center_schedule: WeeklySchedule
    closing_periods: List[ClosingPeriodSchema] = []

    # Stats
    materials_count: int = 0
    missing_count: int = 0
    days_since_last_inventory: Optional[int] = None

    # People
    contacts: List[ContactInfo] = []

    # Alerts
    alerts: List[CenterAlert] = []

    # Whether this is the logged-in user's own center
    is_user_center: bool = False


# ── Update request ────────────────────────────────────────────────────────────

class TimeSlotInput(BaseModel):
    opening_time: str   # "HH:MM"
    closing_time: str


class UpdateCenterRequest(BaseModel):
    telephone: Optional[str] = None
    email: Optional[str] = None
    address: Optional[str] = None          # full address string
    city: Optional[str] = None
    postal_code: Optional[str] = None
    description: Optional[str] = None
    activities: Optional[str] = None       # comma-separated tags
    # schedule: day_name → list of time slots
    schedule: Optional[dict[str, List[TimeSlotInput]]] = None
    closing_periods: Optional[List[ClosingPeriodSchema]] = None
    # headmaster
    headmaster_firstname: Optional[str] = None
    headmaster_lastname: Optional[str] = None
    headmaster_telephone: Optional[str] = None
    headmaster_email: Optional[str] = None
