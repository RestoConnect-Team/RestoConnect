from datetime import datetime
from fastapi import HTTPException
from sqlalchemy import select, delete
from sqlalchemy.orm import Session

from app.services import get_center_service, get_center_admin_service
from app.schemas import UpdateCenterRequest, CenterInfos
from app.database.models import CenterSchedule, ClosingPeriod


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
