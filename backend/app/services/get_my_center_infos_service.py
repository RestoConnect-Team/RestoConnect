from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Center, User

from app.enums import WeekDays, UserStatus
from app.schemas import WeeklySchedule, TimeSlot

def get_my_center(user: User, db: Session):
    
    my_center_query = select(Center).where(Center.center_id == user.center_id)

    return db.scalar(my_center_query)

def schedule_to_dict(center: Center) -> WeeklySchedule:
    result = {jour.value: [] for jour in WeekDays}

    for s in center.schedules:
        result[s.day_of_week.value].append([
            TimeSlot(
                opening_time = s.opening_time.strftime("%H:%M"),
                closing_time = s.closing_time.strftime("%H:%M"),
            )
        ])

    return WeeklySchedule (schedule=result)

def get_center_admin(center: Center, db: Session) -> User | None:
    stmt = select(User).where(
        (User.center_id == center.id) & (User.status == UserStatus.CENTER_ADMIN)
    )

    return db.scalar(stmt)
