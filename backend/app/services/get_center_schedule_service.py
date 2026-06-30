from app.database.models import Center

from app.enums import WeekDays
from app.schemas import WeeklySchedule, TimeSlot

def get_center_schedule_service(center: Center) -> WeeklySchedule:
    result = {jour.value: [] for jour in WeekDays}

    for s in center.schedules:
        result[s.day_of_week.value].append([
            TimeSlot(
                opening_time = s.opening_time.strftime("%H:%M"),
                closing_time = s.closing_time.strftime("%H:%M"),
            )
        ])

    return WeeklySchedule (schedule=result)


