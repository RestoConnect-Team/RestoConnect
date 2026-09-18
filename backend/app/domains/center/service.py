from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.models import Center, User

from app.domains.center.enums import WeekDays
from app.domains.user.enums import UserStatus
from app.domains.center.schemas import WeeklySchedule, TimeSlot


def get_list_centers_service(db: Session):

    list_centers_query = select(Center)

    return db.scalars(list_centers_query).all()


def get_my_center_service(user: User, db: Session) -> Center | None:
    my_center_query = select(Center).where(Center.id == user.center_id)
    return db.scalar(my_center_query)


def get_center_schedule_service(center: Center) -> WeeklySchedule:
    result = {jour.value: [] for jour in WeekDays}

    for s in center.schedules:
        result[s.day_of_week.value].append(
            TimeSlot(
                opening_time=s.opening_time,
                closing_time=s.closing_time,
            )
        )

    return WeeklySchedule(schedule=result)


def get_center_admin_service(center: Center, db: Session) -> User | None:
    stmt = select(User).where(
        (User.center_id == center.id) & (User.status == UserStatus.CENTER_ADMIN)
    )

    return db.scalar(stmt)


def get_center_service(center_id: int, db: Session) -> Center | None:
    center_query = select(Center).where(Center.id == center_id)
    return db.scalar(center_query)


def delete_center_service(center_id: int, db: Session) -> bool:
    center = db.query(Center).filter(Center.id == center_id).one_or_none()
    if not center:
        return False

    db.delete(center)
    db.commit()

    return True