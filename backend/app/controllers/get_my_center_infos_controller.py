from datetime import date
from fastapi import HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.services import (
    get_my_center_service,
    get_user_by_token_service,
    get_center_schedule_service,
    get_center_admin_service,
)
from app.schemas import CenterInfos, ContactInfo, CenterAlert, ClosingPeriodSchema
from app.database.models import Stock, User
from app.enums import StockStatus


def get_my_center_infos_controller(token: str, db: Session) -> CenterInfos:
    if not token:
        raise HTTPException(status_code=401, detail="Not authenticated")
    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    my_center = get_my_center_service(user, db)
    if not my_center:
        raise HTTPException(status_code=404, detail="User has no center assigned")

    schedule = get_center_schedule_service(my_center)
    center_admin = get_center_admin_service(my_center, db)

    if center_admin is None:
        raise HTTPException(status_code=404, detail="Center has no admin assigned")

    # --- Stats ---
    all_stocks = db.scalars(select(Stock).where(Stock.center_id == my_center.id)).all()
    materials_count = len(all_stocks)
    missing_count = sum(1 for s in all_stocks if s.status == StockStatus.LOST)

    scan_dates = [s.last_scan_date for s in all_stocks if s.last_scan_date]
    days_since_last_inventory: int | None = None
    if scan_dates:
        days_since_last_inventory = (date.today() - max(scan_dates)).days

    # --- Contacts (non-admin users of the center) ---
    other_users = db.scalars(
        select(User).where(
            (User.center_id == my_center.id) & (User.id != center_admin.id)
        )
    ).all()
    contacts = [
        ContactInfo(
            id=u.id,
            name=u.name,
            lastname=u.lastname,
            email=u.email,
            telephone=u.telephone,
            status=u.status.value if hasattr(u.status, "value") else str(u.status),
            photo_url=u.photo_url,
        )
        for u in other_users
    ]

    # --- Alerts ---
    alerts: list[CenterAlert] = []
    for stock in all_stocks:
        if stock.status == StockStatus.LOST:
            days_lost = (
                (date.today() - stock.last_scan_date).days
                if stock.last_scan_date
                else 0
            )
            alerts.append(
                CenterAlert(
                    alert_type="missing_stock",
                    message=f"{stock.name} est signalé manquant depuis {days_lost} jour{'s' if days_lost != 1 else ''} au {my_center.name}.",
                    time_ago=f"Il y a {days_lost} jour{'s' if days_lost != 1 else ''}",
                )
            )
    if days_since_last_inventory is not None and days_since_last_inventory > 14:
        alerts.append(
            CenterAlert(
                alert_type="inventory",
                message=f"Dernier inventaire du {my_center.name} : il y a {days_since_last_inventory} jours. Un inventaire est recommandé.",
                time_ago=f"Il y a {days_since_last_inventory} jours",
            )
        )

    # --- Closing periods ---
    closing_periods = [
        ClosingPeriodSchema(id=cp.id, start_date=cp.start_date, end_date=cp.end_date)
        for cp in my_center.closing_periods
    ]

    return CenterInfos(
        center_id=my_center.id,
        name=my_center.name,
        status=my_center.status,
        street_number=my_center.street_number,
        street=my_center.street,
        city=my_center.city,
        postal_code=my_center.postal_code,
        telephone=my_center.telephone,
        email=my_center.email,
        description=my_center.description,
        activities=my_center.activities,
        center_headmaster_name=center_admin.name,
        center_headmaster_lastname=center_admin.lastname,
        center_headmaster_email=center_admin.email,
        center_headmaster_telephone=center_admin.telephone,
        center_schedule=schedule,
        closing_periods=closing_periods,
        materials_count=materials_count,
        missing_count=missing_count,
        days_since_last_inventory=days_since_last_inventory,
        contacts=contacts,
        alerts=alerts,
        is_user_center=True,
    )
