import datetime
from typing import Dict, List
from pydantic import BaseModel

from app.enums import WeekDays


class TimeSlot(BaseModel):
    opening_time: datetime.time
    closing_time: datetime.time

class WeeklySchedule(BaseModel):
    schedule: Dict[WeekDays, List[TimeSlot]]