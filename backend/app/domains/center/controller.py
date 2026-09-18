from datetime import date, datetime

from fastapi import HTTPException
from sqlalchemy import func, select, delete
from sqlalchemy.orm import Session

from app.services.get_user_service import get_user_by_token_service
from app.domains.center.service import (
    get_list_centers_service,
    get_my_center_service,
    get_center_schedule_service,
    get_center_admin_service,
    get_center_service,
    delete_center_service,
)
from app.domains.stock.service import get_stocks_for_center
from app.domains.center.schemas import (
    ListCentersResponse,
    OneCenterFromList,
    CenterInfos,
    ContactInfo,
    CenterAlert,
    ClosingPeriodSchema,
    WarehouseInfos,
    UpdateCenterRequest,
)
from app.domains.stock.schemas import OneEquipementFromList
from app.domains.stock.enums import StockStatus
from app.database.models import Stock, User, CenterSchedule, ClosingPeriod


def _get_counts(center_id: int, db: Session):
    materials_count = db.scalar(
        select(func.count(Stock.id)).where(Stock.center_id == center_id)
    ) or 0
    contacts_count = db.scalar(
        select(func.count(User.id)).where(User.center_id == center_id)
    ) or 0
    return materials_count, contacts_count


def get_list_centers_controller(token: str, db: Session) -> ListCentersResponse:
    list_centers = get_list_centers_service(db)

    user = get_user_by_token_service(db, token)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")

    user_center = get_my_center_service(user, db)
    if not user_center:
        raise HTTPException(status_code=404, detail="User has no center assigned")

    if not list_centers:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")

    uc_materials, uc_contacts = _get_counts(user_center.id, db)
    user_center_item: OneCenterFromList = OneCenterFromList(
        center_id=user_center.id,
        name=user_center.name,
        status=user_center.status,
        city=user_center.city,
        materials_count=uc_materials,
        contacts_count=uc_contacts,
    )
    centers: list[OneCenterFromList] = []
    warehouses: list[OneCenterFromList] = []

    for center in list_centers:
        mat_count, con_count = _get_counts(center.id, db)

        if center.is_warehouse:
            warehouses.append(
                OneCenterFromList(
                    center_id=center.id,
                    name=center.name,
                    status=center.status,
                    city=center.city,
                    materials_count=mat_count,
                    contacts_count=con_count,
                )
            )

        elif center.id == user_center_item.center_id:
            continue
        else:
            centers.append(
                OneCenterFromList(
                    center_id=center.id,
                    name=center.name,
                    status=center.status,
                    city=center.city,
                    materials_count=mat_count,
                    contacts_count=con_count,
                )
            )

    if not centers and not warehouses:
        raise HTTPException(
            status_code=404,
            detail="Aucun centre avec un administrateur assigné n'a été trouvé",
        )

    return ListCentersResponse(user_center=user_center_item, centers_list=centers, warehouses_list=warehouses)


def get_my_center_infos_controller(token: str, db: Session) -> CenterInfos:
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
            days_lost = (date.today() - stock.last_scan_date).days if stock.last_scan_date else 0
            alerts.append(CenterAlert(
                alert_type="missing_stock",
                message=f"{stock.name} est signalé manquant depuis {days_lost} jour{'s' if days_lost != 1 else ''} au {my_center.name}.",
                time_ago=f"Il y a {days_lost} jour{'s' if days_lost != 1 else ''}",
            ))
    if days_since_last_inventory is not None and days_since_last_inventory > 14:
        alerts.append(CenterAlert(
            alert_type="inventory",
            message=f"Dernier inventaire du {my_center.name} : il y a {days_since_last_inventory} jours. Un inventaire est recommandé.",
            time_ago=f"Il y a {days_since_last_inventory} jours",
        ))

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


def get_center_infos_controller(center_id: int, db: Session, token: str | None = None) -> CenterInfos:
    center = get_center_service(center_id, db)
    if not center:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")

    center_schedule = get_center_schedule_service(center)
    center_admin = get_center_admin_service(center, db)
    if center_admin is None:
        raise HTTPException(status_code=404, detail="Aucun administrateur pour ce centre")

    # --- Stats ---
    all_stocks = db.scalars(select(Stock).where(Stock.center_id == center_id)).all()
    materials_count = len(all_stocks)
    missing_count = sum(1 for s in all_stocks if s.status == StockStatus.LOST)

    scan_dates = [s.last_scan_date for s in all_stocks if s.last_scan_date]
    days_since_last_inventory: int | None = None
    if scan_dates:
        days_since_last_inventory = (date.today() - max(scan_dates)).days

    # --- Contacts (non-admin users of the center) ---
    other_users = db.scalars(
        select(User).where(
            (User.center_id == center_id) & (User.id != center_admin.id)
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
            days_lost = (date.today() - stock.last_scan_date).days if stock.last_scan_date else 0
            alerts.append(CenterAlert(
                alert_type="missing_stock",
                message=f"{stock.name} est signalé manquant depuis {days_lost} jour{'s' if days_lost != 1 else ''} au {center.name}.",
                time_ago=f"Il y a {days_lost} jour{'s' if days_lost != 1 else ''}",
            ))
    if days_since_last_inventory is not None and days_since_last_inventory > 14:
        alerts.append(CenterAlert(
            alert_type="inventory",
            message=f"Dernier inventaire du {center.name} : il y a {days_since_last_inventory} jours. Un inventaire est recommandé.",
            time_ago=f"Il y a {days_since_last_inventory} jours",
        ))

    # --- Is user's own center ---
    is_user_center = False
    if token:
        user = get_user_by_token_service(db, token)
        if user:
            user_center = get_my_center_service(user, db)
            is_user_center = user_center is not None and user_center.id == center_id

    closing_periods = [
        ClosingPeriodSchema(id=cp.id, start_date=cp.start_date, end_date=cp.end_date)
        for cp in center.closing_periods
    ]

    return CenterInfos(
        center_id=center.id,
        name=center.name,
        status=center.status,
        street_number=center.street_number,
        street=center.street,
        city=center.city,
        postal_code=center.postal_code,
        telephone=center.telephone,
        email=center.email,
        description=center.description,
        activities=center.activities,
        center_headmaster_name=center_admin.name,
        center_headmaster_lastname=center_admin.lastname,
        center_headmaster_email=center_admin.email,
        center_headmaster_telephone=center_admin.telephone,
        center_schedule=center_schedule,
        closing_periods=closing_periods,
        materials_count=materials_count,
        missing_count=missing_count,
        days_since_last_inventory=days_since_last_inventory,
        contacts=contacts,
        alerts=alerts,
        is_user_center=is_user_center,
    )


def get_warehouse_infos_controller(warehouse_id: int, db: Session) -> WarehouseInfos:

    warehouse = get_center_service(warehouse_id, db)
    if not warehouse:
        raise HTTPException(status_code=404, detail="Aucun entrepôt trouvé")

    warehouse_schedule = get_center_schedule_service(warehouse)
    warehouse_admin = get_center_admin_service(warehouse, db)

    if warehouse_admin is None:
        raise HTTPException(status_code=404, detail="Aucun administrateur pour ce centre")

    stock = get_stocks_for_center(warehouse, db)

    warehouse_stock = OneEquipementFromList(
        id=stock.id,
        name=stock.name,
        reference=stock.reference,
        category=stock.category,
        status=stock.status,
        qr_code=stock.qr_code,
    )

    return   WarehouseInfos(
        warehouse_id=warehouse.id,
        name=warehouse.name,
        status=warehouse.status,
        street=warehouse.street,
        city=warehouse.city,
        postal_code=warehouse.postal_code,
        description=warehouse.description,
        activities=warehouse.activities,
        center_headmaster_name=warehouse_admin.name,
        center_headmaster_lastname=warehouse_admin.lastname,
        center_headmaster_email=warehouse_admin.email,
        center_headmaster_telephone=warehouse_admin.telephone,
        warehouse_schedule=warehouse_schedule,
        stocks_list= warehouse_stock,
    )


def update_center_controller(center_id: int, payload: UpdateCenterRequest, db: Session) -> dict:
    center = get_center_service(center_id, db)
    if not center:
        raise HTTPException(status_code=404, detail="Aucun centre trouvé")

    center_admin = get_center_admin_service(center, db)
    if not center_admin:
        raise HTTPException(status_code=404, detail="Aucun administrateur pour ce centre")

    # ── Update center fields ──────────────────────────────────────────────────
    if payload.telephone is not None:
        center.telephone = payload.telephone
    if payload.email is not None:
        center.email = payload.email
    if payload.address is not None:
        center.street = payload.address
        center.street_number = None
    if payload.city is not None:
        center.city = payload.city
    if payload.postal_code is not None:
        center.postal_code = payload.postal_code
    if payload.description is not None:
        center.description = payload.description
    if payload.activities is not None:
        center.activities = payload.activities

    # ── Update schedule ───────────────────────────────────────────────────────
    if payload.schedule is not None:
        db.execute(delete(CenterSchedule).where(CenterSchedule.center_id == center_id))
        for day_name, slots in payload.schedule.items():
            for slot in slots:
                opening = datetime.strptime(slot.opening_time, "%H:%M").time()
                closing = datetime.strptime(slot.closing_time, "%H:%M").time()
                db.add(CenterSchedule(
                    center_id=center_id,
                    day_of_week=day_name,
                    opening_time=opening,
                    closing_time=closing,
                ))

    # ── Update closing periods ────────────────────────────────────────────────
    if payload.closing_periods is not None:
        db.execute(delete(ClosingPeriod).where(ClosingPeriod.center_id == center_id))
        for cp in payload.closing_periods:
            db.add(ClosingPeriod(
                center_id=center_id,
                start_date=cp.start_date,
                end_date=cp.end_date,
            ))

    # ── Update headmaster ─────────────────────────────────────────────────────
    if payload.headmaster_firstname is not None:
        center_admin.name = payload.headmaster_firstname
    if payload.headmaster_lastname is not None:
        center_admin.lastname = payload.headmaster_lastname
    if payload.headmaster_telephone is not None:
        center_admin.telephone = payload.headmaster_telephone
    if payload.headmaster_email is not None:
        center_admin.email = payload.headmaster_email

    db.commit()
    return {"detail": "Centre mis à jour avec succès"}


def delete_center_controller(center_id: int, db: Session) -> bool:
    if not delete_center_service(center_id, db):
        raise HTTPException(status_code=404, detail="Center not found")
    return delete_center_service(center_id, db)